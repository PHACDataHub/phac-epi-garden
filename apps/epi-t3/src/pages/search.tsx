import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import {
  skills, SkillPillSearchResults, type Skill, SkillPills
} from "~/components/taxonomy";

const SearchPage: NextPage = () => {
  const [search, setSearch] = useState("");
  const onSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  };

  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const onPillClickSelect = (skill: Skill) => {
    // You may want to prevent the same skill from being added multiple times
    if (!selectedSkills.find(s => s.domain === skill.domain && s.name_en === skill.name_en)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const onPillClickRemove = (skillToRemove: Skill) => {
    setSelectedSkills(selectedSkills.filter(
      (skill) =>
        !(skill.domain === skillToRemove.domain && skill.name_en === skillToRemove.name_en)
    ));
  };

  // skills that are notSelected
  const remainingSkills = skills.filter(
    (skill) =>
      !selectedSkills.some(
        (clickedSkill) =>
          clickedSkill.domain === skill.domain && clickedSkill.name_en === skill.name_en
      )
  );

  console.log('Clicked skills:', selectedSkills);

  return (
    <>
      <Head>
        <title>Taxonomy - Epicenter</title>
        <meta name="description" content="Taxonomy - Epicenter" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 pb-4 md:max-w-5xl">
        <h2 className="text-2xl font-extrabold my-4">Taxonomy Search</h2>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            Searching for: <SkillPills skills={selectedSkills} onClick={onPillClickRemove} />
          </div>
          <div className="flex flex-wrap gap-2">
            Add some search criteria, by clicking on a Skill.
            You can refine by searching
          </div>
          <form className="flex items-center max-w-lg">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                onChange={onSearchChange}
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
                required
              />
            </div>
          </form>

        </div>

        <div className="relative overflow-x-auto">
          <div className="flex flex-wrap gap-2">
            <SkillPillSearchResults search={search} onClick={onPillClickSelect} allSkills={remainingSkills}></SkillPillSearchResults>
          </div>
        </div>
      </main>
    </>
  );
}

export default SearchPage;