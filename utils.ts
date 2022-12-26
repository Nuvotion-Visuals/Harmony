import * as path from 'path'
import fs from 'fs'

export function readDirectoryHierarchy(dir: string): object {
  const hierarchy: any = {};

  // Get a list of all files and directories in the given directory
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Iterate through the entries and add them to the hierarchy object
  for (const entry of entries) {
    const entryName = entry.name;

    if (entry.isDirectory()) {
      // If the entry is a directory, recursively read its hierarchy and add it to the object
      hierarchy[entryName] = readDirectoryHierarchy(path.join(dir, entryName));
    } else if (entry.isFile()) {
      // If the entry is a file, add it to the object
      hierarchy[entryName] = null;
    }
  } 
  
  return hierarchy;
}

export const titleToSlug = (title: string): string => {
  // Replace all non-alphanumeric characters with hyphens
  return title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

export const slugToTitle = (slug: string): string => {
  // Replace hyphens with spaces
  const title = slug.replace(/-/g, ' ');

  // Split the title into words
  const words = title.split(' ');

  // Create an array of lowercase words that should not be capitalized
  const lowercaseWords = [
    'a', 'an', 'and', 'as', 'at', 'but', 'by',
    'for', 'if', 'in', 'nor', 'of', 'off', 'on',
    'or', 'per', 'so', 'the', 'to', 'up', 'via', 'yet'
  ];

  // Capitalize each word, unless it should be lowercase
  return words.map((word) => {
    return lowercaseWords.includes(word) ? word : word.replace(/\b\w/g, (w) => w.toUpperCase());
  }).join(' ');
}

export function readMarkdownFileInDirectory(dir: string, slugs: string[]): string | null {
  // Get a list of all files and directories in the given directory
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Iterate through the entries and check if any of them match the slugs
  for (const entry of entries) {
    const entryName = entry.name;
    const entrySlug = titleToSlug(entryName.split('.')[0]);

if (entry.isDirectory()) {
  // If the entry is a directory, recursively search its hierarchy for the matching markdown file
  const result = readMarkdownFileInDirectory(path.join(dir, entryName), slugs);
  if (result !== null) {
    // If the markdown file was found, return its contents
    return result;
  }
} else if (entry.isFile()) {
  // If the entry is a file, check if it is the matching markdown file
  if (slugs.length === 0 || slugs[0] !== titleToSlug(path.basename(dir))) {
    // If the slugs array is empty or the current directory's name does not match the first slug, do nothing
  } else {
    // If the current directory's name matches the first slug, check if the file's slug matches the second slug
    if (slugs.length === 1 || slugs[1] !== entrySlug) {
      // If the slugs array has only one element or the file's slug does not match the second slug, do nothing
    } else {
      // If the file's slug matches the second slug, read the file and return its contents
      return fs.readFileSync(path.join(dir, entryName), 'utf8');
    }
  }
}
  }

  // If no matching markdown file was found and the slugs array is not empty, check if the last slug in the array matches the current directory's name
  if (slugs.length > 0 && slugs[slugs.length - 1] === titleToSlug(path.basename(dir))) {
    // If the last slug in the array matches the current directory's name, check if there is a file named "Readme.md" in the current directory
    const readmePath = path.join(dir, 'Readme.md');
    if (fs.existsSync(readmePath)) {
      // If the Readme.md file is found, read and return its contents
      return fs.readFileSync(readmePath, 'utf8');
    }
  }

  // If no matching markdown file was found, return null
  return null;
}