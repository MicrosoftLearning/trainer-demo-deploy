/**
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
 */

/* eslint-disable global-require */

import { sortBy } from '../utils/jsUtils';
import { TagType, User, Tags } from './tags';
import templates from '../../static/templates.json'

// *** ADDING DATA TO AZD GALLERY ****/

// Currently using Custom Issues on Repo

// *************** CARD DATA STARTS HERE ***********************
// Add your site to this list
// prettier-ignore

export const unsortedUsers: User[] = templates as User[]

export const TagList = Object.keys(Tags) as TagType[];
function sortUsers() {
  let result = unsortedUsers;
  // Sort by site name
  result = sortBy(result, (user) => user.title.toLowerCase());
  return result;
}

export const sortedUsers = sortUsers();

// Extract unique authors from templates
export function getUniqueAuthors(): string[] {
  const authorSet = new Set<string>();
  unsortedUsers.forEach((user) => {
    if (user.author) {
      // Handle multiple authors (comma-separated)
      if (user.author.includes(", ")) {
        const multiAuthors = user.author.split(", ");
        multiAuthors.forEach((author) => authorSet.add(author.trim()));
      } else {
        authorSet.add(user.author.trim());
      }
    }
  });
  return Array.from(authorSet).sort();
}

export const authorList = getUniqueAuthors();
