"use client";

import Image from "next/image";
import { useQuery } from "react-query";
import axios from "axios";
import search from "../components/assets/search.svg";
import chevronDown from "../components/assets/chevron-down.svg";
import { useState } from "react";

const Th = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <th
      className={`text-left p-4 font-normal text-[#537087] w-[152px] max-w-[152px] ${className}`}
    >
      {children}
    </th>
  );
};

const Td = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <td
      className={`px-4 py-1 font-normal text-[#537087] text-left ${className}`}
    >
      {children}
    </td>
  );
};

export default function Table() {
  // Pagination state - if needed later on
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoading, error, data } = useQuery(["studies", page, searchQuery], () => {
    return axios.get(`/studies?page=${page}&search=${searchQuery}`).then((res) => res.data);
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className="bg-white border m-[-1px] shadow-default-shadow text-primary rounded-lg border-[
        #d0d5dd]"
    >
      <div className="flex flex-col text-sm leading-[18px]">
        <section className="p-4">
          <div className="border bg-white shadow-default-shadow h-8 rounded-md px-3.5 py-[7px] text-sm flex gap-2 w-[264px] overflow-hidden">
            <Image src={search} width={12} height={12} alt="Search icon" />
            <input
              type="search"
              className="focus:outline-none w-full"
              placeholder="Search"
              onChange={handleSearch}
            />
          </div>
        </section>
        <table
          className="border-t border-solid border-[
        #d0d5dd]"
        >
          <thead
            className="bg-gray-100 border-b border-solid border-[
        #d0d5dd]"
          >
            <tr>
              <Th className="w-[320px] max-w-[320px]">Title</Th>
              <Th>Date</Th>
              <Th>Document</Th>
              <Th>Topic</Th>
              <Th>Status</Th>
              <Th className="w-[72px]"></Th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-4 text-sm">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={6} className="p-4 text-sm text-red-400">
                  Something went wrong.
                </td>
              </tr>
            )}
            {data?.map((d: any) => {
              return (
                <>
                  <tr
                    key={d.id}
                    className="border-b border-solid border-[
                    #d0d5dd]"
                  >
                    <Td className="text-ellipsis max-w-[320px] truncate">
                      {d.title}
                    </Td>
                    <Td className="">{d.issued_year}</Td>
                    <Td className="">
                      <a href={d.web_link} className="hover:underline">
                        Link
                      </a>
                    </Td>
                    <Td className="">
                      <span
                        dangerouslySetInnerHTML={{ __html: d.topic.name }}
                      ></span>
                    </Td>
                    <Td className="capitalize">{d.status}</Td>
                    <Td>
                      <button
                        className={`p-2 ${expanded === d.id && "rotate-180"}`}
                      >
                        <Image
                          src={chevronDown}
                          width={22}
                          height={22}
                          alt="Search icon"
                          onClick={() => {
                            if (expanded === d.id) {
                              setExpanded(0);
                            } else {
                              setExpanded(d.id);
                            }
                          }}
                        />
                      </button>
                    </Td>
                  </tr>
                  {expanded === d.id && (
                    <tr
                      className="border-b border-solid border-[
                            #d0d5dd] leading-5"
                    >
                      <td colSpan={6} className="p-4 text-[#537087]">
                        <h1 className="text-xl font-bold mb-4">Summary:</h1>
                        <p>{d.summary}</p>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
          <tfoot className="h-[60px] align-middle text-center">
            <tr>
              <td colSpan={6}>
                <button onClick={() => setPage(page - 1)}>
                  {"< Previous"}
                </button>
                <button onClick={() => setPage(page + 1)} className="px-3">
                  {"Next >"}
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
