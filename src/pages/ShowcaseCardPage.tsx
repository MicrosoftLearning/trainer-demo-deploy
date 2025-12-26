/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  UserState,
  InputValue,
} from "../components/gallery/ShowcaseTemplateSearch";
import { Tags, type User, type TagType, getTag } from "../data/tags";
import { sortedUsers, unsortedUsers } from "../data/users";
import {
  Text,
  Combobox,
  Option,
  Spinner,
  Badge,
  Body1,
} from "@fluentui/react-components";
import ShowcaseCards from "./ShowcaseCards";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import { useColorMode } from "@docusaurus/theme-common";
import { useHistory } from "@docusaurus/router";
import { toggleListItem } from "@site/src/utils/jsUtils";
import { prepareUserState } from "./index";
import { Dismiss20Filled } from "@fluentui/react-icons";

const TagQueryStringKey2 = "tags";
const AuthorQueryStringKey = "authors";

const readSearchTags2 = (search: string): TagType[] => {
  return new URLSearchParams(search).getAll(TagQueryStringKey2) as TagType[];
}

const readSearchAuthors = (search: string): string[] => {
  return new URLSearchParams(search).getAll(AuthorQueryStringKey);
}

function replaceSearchTags(search: string, newTags: TagType[]) {
  const searchParams = new URLSearchParams(search);
  searchParams.delete(TagQueryStringKey2);
  newTags.forEach((tag) => searchParams.append(TagQueryStringKey2, tag));
  return searchParams.toString();
}

function replaceSearchAuthors(search: string, newAuthors: string[]) {
  const searchParams = new URLSearchParams(search);
  searchParams.delete(AuthorQueryStringKey);
  newAuthors.forEach((author) => searchParams.append(AuthorQueryStringKey, author));
  return searchParams.toString();
}

// updates only the url query
const toggleTag = (tag: TagType, location: Location) => {
  const history = useHistory();
  return useCallback(() => {
    const tags = readSearchTags2(location.search);
    const newTags = toggleListItem(tags, tag);
    const newSearch = replaceSearchTags(location.search, newTags);
    history.push({
      ...location,
      search: newSearch,
      state: prepareUserState(),
    });
  }, [tag, location, history]);
}

function restoreUserState(userState: UserState | null) {
  const { scrollTopPosition, focusedElementId } = userState ?? {
    scrollTopPosition: 0,
    focusedElementId: undefined,
  };
  // @ts-expect-error: if focusedElementId is undefined it returns null
  document.getElementById(focusedElementId)?.focus();
  window.scrollTo({ top: scrollTopPosition });
}

const SORT_BY_OPTIONS = [
  "New to old",
  "Old to new",
  "Alphabetical (A - Z)",
  "Alphabetical (Z - A)",
];

function readSortChoice(rule: string): User[] {
  if (rule == SORT_BY_OPTIONS[0]) {
    const copyUnsortedUser = unsortedUsers.slice();
    return copyUnsortedUser.reverse();
  } else if (rule == SORT_BY_OPTIONS[1]) {
    return unsortedUsers;
  } else if (rule == SORT_BY_OPTIONS[2]) {
    return sortedUsers;
  } else if (rule == SORT_BY_OPTIONS[3]) {
    const copySortedUser = sortedUsers.slice();
    return copySortedUser.reverse();
  }
  return sortedUsers;
}

const SearchNameQueryKey = "name";

function readSearchName(search: string) {
  return new URLSearchParams(search).get(SearchNameQueryKey);
}

function filterUsers(
  users: User[],
  selectedTags: TagType[],
  searchName: string | null,
  selectedAuthors: string[]
) {
  if (searchName) {
    // eslint-disable-next-line no-param-reassign
    users = users.filter((user) =>
      user.title.toLowerCase().includes(searchName.toLowerCase())
    );
  }
  if (selectedTags && selectedTags.length > 0) {
    users = users.filter((user) => {
      if (!user && !user.tags && user.tags.length === 0) {
        return false;
      }
      return selectedTags.every((tag) => user.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
    });
  }
  if (selectedAuthors && selectedAuthors.length > 0) {
    users = users.filter((user) => {
      if (!user || !user.author) {
        return false;
      }
      // Handle multiple authors (comma-separated)
      const userAuthors = user.author.includes(", ") 
        ? user.author.split(", ").map(a => a.trim())
        : [user.author.trim()];
      
      return selectedAuthors.some((selectedAuthor) => 
        userAuthors.includes(selectedAuthor)
      );
    });
  }
  return users;
}

function FilterAppliedBar({
  clearAll,
  selectedTags,
  selectedAuthors,
  readSearchTags,
  replaceSearchTags,
  readSearchAuthors,
  replaceSearchAuthors,
}: {
  clearAll;
  selectedTags: TagType[];
  selectedAuthors: string[];
  readSearchTags: (search: string) => TagType[];
  replaceSearchTags: (search: string, newTags: TagType[]) => string;
  readSearchAuthors: (search: string) => string[];
  replaceSearchAuthors: (search: string, newAuthors: string[]) => string;
}) {
  const history = useHistory();
  const toggleTag = (tag: TagType, location: Location) => {
    const tags = readSearchTags(location.search);
    const newTags = toggleListItem(tags, tag);
    const newSearch = replaceSearchTags(location.search, newTags);
    history.push({
      ...location,
      search: newSearch,
      state: prepareUserState(),
    });
  }

  const toggleAuthor = (author: string, location: Location) => {
    const authors = readSearchAuthors(location.search);
    const newAuthors = toggleListItem(authors, author);
    const newSearch = replaceSearchAuthors(location.search, newAuthors);
    history.push({
      ...location,
      search: newSearch,
      state: prepareUserState(),
    });
  }

  return (selectedTags && selectedTags.length > 0) || (selectedAuthors && selectedAuthors.length > 0) ? (
    <div className={styles.filterAppliedBar}>
      <Body1>
        Filters applied:
      </Body1>
      {selectedTags.map((tag, index) => {
        const tagObject = getTag(tag);
        const key = `showcase_checkbox_key_${tag}`;
        const id = `showcase_checkbox_id_${tag}`;

        return (
          <Badge
            appearance="tint"
            size="extra-large"
            color="brand"
            shape="rounded"
            icon={<Dismiss20Filled />}
            iconPosition="after"
            className={styles.filterBadge}
            onClick={() => {
              toggleTag(tag, location);
            }}
          >
            {tagObject.label}
          </Badge>
        );
      })}
      {selectedAuthors.map((author, index) => {
        const key = `showcase_author_badge_key_${author.replace(/\s+/g, '_')}`;

        return (
          <Badge
            key={key}
            appearance="tint"
            size="extra-large"
            color="brand"
            shape="rounded"
            icon={<Dismiss20Filled />}
            iconPosition="after"
            className={styles.filterBadge}
            onClick={() => {
              toggleAuthor(author, location);
            }}
          >
            {author}
          </Badge>
        );
      })}
      <div className={styles.clearAll} onClick={clearAll}>
        Clear all
      </div>
    </div>
  ) : null;
}

export default function ShowcaseCardPage({
  setActiveTags,
  selectedTags,
  location,
  setSelectedTags,
  readSearchTags,
  replaceSearchTags,
  setSelectedCheckbox,
  setActiveAuthors,
  selectedAuthors,
  setSelectedAuthors,
  readSearchAuthors,
  replaceSearchAuthors,
}: {
  setActiveTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  selectedTags: TagType[];
  location;
  setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  readSearchTags: (search: string) => TagType[];
  replaceSearchTags: (search: string, newTags: TagType[]) => string;
  setSelectedCheckbox: React.Dispatch<React.SetStateAction<TagType[]>>;
  setActiveAuthors: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAuthors: string[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<string[]>>;
  readSearchAuthors: (search: string) => string[];
  replaceSearchAuthors: (search: string, newAuthors: string[]) => string;
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const clearAll = () => {
    setSelectedTags([]);
    setSelectedCheckbox([]);
    setSelectedAuthors([]);
    searchParams.delete("tags");
    searchParams.delete("authors");
    history.push({
      ...location,
      search: searchParams.toString(),
      state: prepareUserState(),
    });
  };

  useEffect(() => {
    setSelectedTags(readSearchTags(location.search));
    setSelectedAuthors(readSearchAuthors(location.search));
    setSelectedUsers(readSortChoice(selectedOptions[0]));
    setSearchName(readSearchName(location.search));
    restoreUserState(location.state);
    setLoading(false);
  }, [location, selectedOptions]);

  var cards = useMemo(
    () => filterUsers(selectedUsers, selectedTags, searchName, selectedAuthors),
    [selectedUsers, selectedTags, searchName, selectedAuthors]
  );

  useEffect(() => {
    const unionTags = new Set<TagType>();
    const unionAuthors = new Set<string>();
    cards.forEach((user) => {
      user.tags.forEach((tag) => unionTags.add(tag.toLowerCase()));
      if (user.author) {
        // Handle multiple authors (comma-separated)
        if (user.author.includes(", ")) {
          const multiAuthors = user.author.split(", ");
          multiAuthors.forEach((author) => unionAuthors.add(author.trim()));
        } else {
          unionAuthors.add(user.author.trim());
        }
      }
    });
    setActiveTags(Array.from(unionTags));
    setActiveAuthors(Array.from(unionAuthors));
  }, [cards]);

  const sortByOnSelect = (event, data) => {
    setLoading(true);
    setSelectedOptions(data.selectedOptions);
  };
  const templateNumber = cards ? cards.length : 0;

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
            flex: 1,
          }}
        >
          <Text size={400}>Viewing</Text>
          <Text size={400} weight="bold">
            {templateNumber}
          </Text>
          {templateNumber != 1 ? (
            <Text size={400}>templates</Text>
          ) : (
            <Text size={400}>template</Text>
          )}
          {InputValue != null ? (
            <>
              <Text size={400}>for</Text>
              <Text size={400} weight="bold">
                '{InputValue}'
              </Text>
            </>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <Text size={400}>Sort by: </Text>
          <Combobox
            style={{ minWidth: "unset" }}
            input={{ style: { width: "130px" } }}
            aria-labelledby="combo-default"
            placeholder={SORT_BY_OPTIONS[2]}
            onOptionSelect={sortByOnSelect}
          >
            {SORT_BY_OPTIONS.map((option) => (
              <Option key={option}>{option}</Option>
            ))}
          </Combobox>
        </div>
      </div>
      <FilterAppliedBar
        clearAll={clearAll}
        selectedTags={selectedTags}
        selectedAuthors={selectedAuthors}
        readSearchTags={readSearchTags}
        replaceSearchTags={replaceSearchTags}
        readSearchAuthors={readSearchAuthors}
        replaceSearchAuthors={replaceSearchAuthors}
      />
      {loading ? (
        <Spinner labelPosition="below" label="Loading..." />
      ) : (
        <ShowcaseCards filteredUsers={cards} />
      )}
    </>
  );
}
