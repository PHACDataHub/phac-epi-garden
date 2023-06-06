# Deploy to GCP using bash/cli (from Cloud Shell for example)

Deploy our two containers manually with `gcloud`

## Build containers locally

```bash
docker compose build

# yields
$ docker images | grep epi
phac-epi-garden-epi-docs                          latest            5b89c210c6df   5 minutes ago   201MB
phac-epi-garden-epi-t3                            latest            403e617fd108   2 days ago      224MB
```

## Create an artifact registry repository

```bash
# project name is phx-danl
export PROJECT_ID="pdcp-cloud-009-danl"
# Get the PROJECT_NUMBER from the PROJECT_ID
export PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
export REGION="northamerica-northeast1"
export ARTIFACT_REGISTRY_REPO_NAME="epi-repo"

# Create an artifact registry repository
gcloud artifacts repositories create ${ARTIFACT_REGISTRY_REPO_NAME} \
   --repository-format=docker \
   --location=${REGION} \
   --description="${ARTIFACT_REGISTRY_REPO_NAME}"

# Allow our service account to read from the registry
gcloud artifacts repositories add-iam-policy-binding ${ARTIFACT_REGISTRY_REPO_NAME} \
    --location=${REGION} \
    --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
    --role="roles/artifactregistry.reader"
```

## Register CloudBuild Trigger

```bash
export PROJECT_ID="pdcp-cloud-009-danl"
export REGION="northamerica-northeast1"
export GITHUB_REPO_NAME="phac-epi-garden"
export GITHUB_REPO_OWNER="daneroo"

# list all existing triggers
gcloud builds triggers list --format="table(name, createTime)" --region ${REGION}

# confirm the trigger was created
gcloud builds triggers describe test-site-nginx-001 --region ${REGION}

# list all existing triggers - to see if the new trigger appeared
gcloud builds triggers list --format="table(name, createTime)" --region ${REGION}

# Now, in a loop create a trigger for each of our services
for svc in epi-docs; do
  gcloud builds triggers create github \
    --name=${GITHUB_REPO_NAME}-${svc} \
    --region ${REGION} \
    --repo-name=${GITHUB_REPO_NAME} \
    --repo-owner=${GITHUB_REPO_OWNER} \
    --branch-pattern="^main$" \
    --build-config=deploy/cloudbuild/cloudbuild-${svc}.yaml
done

# list all existing triggers - to see if the new triggers appeared, one for each service
gcloud builds triggers list --format="table(name, createTime)" --region ${REGION}

# At this point you could push to the main branch of your github repo, and see the triggers fire

# If this was only a test, you can delete all the triggers with the following command
for svc in time-go time-deno site-nginx site-caddy; do
  gcloud builds triggers delete --region ${REGION} ${GITHUB_REPO_NAME}-${svc}
done
```

## Deploy to cloudrun

```bash
# so we can push from a local docker registry
gcloud auth login


# project name is phx-danl
export PROJECT_ID="pdcp-cloud-009-danl"
export REGION="northamerica-northeast1"
export ARTIFACT_REGISTRY_REPO_NAME="epi-repo"

gcloud config set project ${PROJECT_ID}
gcloud config set run/region ${REGION}

# Allow our docker client to read/write from the registry (for later)
gcloud auth configure-docker ${REGION}-docker.pkg.dev
# docker tag <LOCAL_IMAGE_NAME> gcr.io/<PROJECT_ID>/<IMAGE_NAME>

# e.g.: Pushes should be of the form docker push HOST-NAME/PROJECT-ID/REPOSITORY/IMAGE:TAG
docker tag phac-epi-garden-epi-docs:latest ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO_NAME}/epi-docs:latest
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO_NAME}/epi-docs:latest
gcloud run deploy epi-docs --allow-unauthenticated --image ${REGION}-docker.pkg.dev/pdcp-cloud-009-danl/${ARTIFACT_REGISTRY_REPO_NAME}/epi-docs:latest


# Now, in a loop for each service; tag and push to the registry, then deploy to cloud run
for i in epi-docs; do
  # destination tag
  docker tag phac-epi-garden-$i:latest ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO_NAME}/$i:latest
  # push to registry
  docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO_NAME}/$i:latest
  # deploy to cloud run
  gcloud run deploy $i --allow-unauthenticated --image ${REGION}-docker.pkg.dev/pdcp-cloud-009-danl/${ARTIFACT_REGISTRY_REPO_NAME}/$i:latest
done
```