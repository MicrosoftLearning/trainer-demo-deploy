import { describe, expect, test } from '@jest/globals';
import type { User, TagType } from '../src/data/tags';
import { TagList } from '../src/data/users';
import Templates from '../static/templates.json';

function pickDescriptionOnlyNeedle(user: User): string | null {
	const title = (user.title ?? '').toLowerCase();
	const description = (user.description ?? '').toLowerCase();

	const words = description
		.split(/[^a-z0-9]+/i)
		.map((w) => w.trim())
		.filter((w) => w.length >= 6);

	for (let i = 0; i < words.length; i += 1) {
		const w = words[i];
		if (title.indexOf(w) === -1) {
			return w;
		}
	}

	return null;
}

function filterUsers(
	users: User[],
	selectedTags: TagType[],
	searchName: string | null,
	selectedAuthors: string[]
): User[] {
	let result = users;

	if (searchName) {
		const needle = searchName.toLowerCase();
		result = result.filter((user) => {
			const title = user.title.toLowerCase();
			const description = (user.description ?? '').toLowerCase();
			return title.indexOf(needle) !== -1 || description.indexOf(needle) !== -1;
		});
	}

	if (selectedTags && selectedTags.length > 0) {
		result = result.filter((user) =>
			selectedTags.every((tag) =>
				user.tags.map((t) => t.toLowerCase()).indexOf(tag.toLowerCase()) !== -1
			)
		);
	}

	if (selectedAuthors && selectedAuthors.length > 0) {
		result = result.filter((user) => {
			if (!user.author) {
				return false;
			}
			const userAuthors = user.author.indexOf(', ') !== -1
				? user.author.split(', ').map((a) => a.trim())
				: [user.author.trim()];
			return selectedAuthors.some((a) => userAuthors.indexOf(a) !== -1);
		});
	}

	return result;
}

describe('Search tests', () => {
	test("Regression: 'Standard SKU' matches API Management template by description", () => {
		const users = Templates as unknown as User[];
		const apiManagement = users.find((u) => u.title === 'API Management with ConferenceAPI');
		expect(apiManagement).toBeDefined();
		expect((apiManagement as User).description.toLowerCase().indexOf('standard sku') !== -1).toBe(true);

		const matches = filterUsers(users, [], 'Standard SKU', []);
		expect(matches.some((u) => u.title === 'API Management with ConferenceAPI')).toBe(true);
	});

	test('Search matches title OR description while respecting author and tag filters', () => {
		const users = Templates as unknown as User[];

		const candidate = users.find((u) => {
			if (!u || !u.title || !u.description || !u.author || !u.tags || u.tags.length === 0) {
				return false;
			}
			return pickDescriptionOnlyNeedle(u) !== null;
		});

		expect(candidate).toBeDefined();
		const user = candidate as User;

		const needle = pickDescriptionOnlyNeedle(user);
		expect(needle).not.toBeNull();

		const selectedTag = user.tags[0];
		const firstAuthor = user.author.indexOf(', ') !== -1
			? user.author.split(', ')[0].trim()
			: user.author.trim();

		const matches = filterUsers(users, [selectedTag], needle, [firstAuthor]);
		expect(matches.some((u) => u.title === user.title)).toBe(true);

		const authorMismatch = filterUsers(users, [selectedTag], needle, ['Definitely Not An Author']);
		expect(authorMismatch.length).toBe(0);

		const otherKnownTag = (TagList.find((t) => user.tags.indexOf(t) === -1) ?? null) as TagType | null;
		const impossibleTag = ('__no_such_tag__' as unknown) as TagType;
		const tagToUse = otherKnownTag ?? impossibleTag;

		const tagMismatch = filterUsers(users, [tagToUse], needle, [firstAuthor]);
		expect(tagMismatch.some((u) => u.title === user.title)).toBe(false);
	});
});
