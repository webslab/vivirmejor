import { defineCollection, z } from "astro:content";

type Image = {
	image: () => z.ZodTypeAny;
};

const membersCollection = defineCollection({
	type: "data",
	schema: ({ image }: Image) =>
		z.object({
			id: z.number(),
			group: z.number(),
			titulo: z.string().optional(),
			name: z.string(),
			position: z.string(),
			department: z.string(),
			photo: image(),
		}),
});

export const collections = {
	"members": membersCollection,
};
