import { describe, expect, test } from '@jest/globals';
import { getTag } from '../src/data/tags';
import Templates from '../static/templates.json';

describe('Template tests', () => {
    test('Tags exists', () => {
        // Get the unique tags from all templates by iterating all templates and taking the tags into a map
        var tags = new Array<string>();
        Templates.forEach(template => {
            template.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        });
        // Check if all tags exist in the Tags enum (case-insensitive using getTag helper)
        tags.forEach(tag => {
            const tagDefinition = getTag(tag);
            if (tagDefinition === undefined) {
                console.error(`Error: The tag "${tag}" is not defined in ./src/data/tags.tsx.`);
            }
            expect(tagDefinition).toBeDefined();
        });
    });
});
