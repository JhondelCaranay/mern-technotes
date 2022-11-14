import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
	// put completed in buttom
	// sortComparer: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1),
	// sort by completed and createdAt
	sortComparer: (a, b) => {
		if (a.completed === b.completed) {
			return a.createdAt > b.createdAt ? -1 : 1;
		} else {
			return a.completed ? 1 : -1;
		}
	},
});

const initialState = notesAdapter.getInitialState({});

export const notesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotes: builder.query({
			query: () => "/api/notes",
			validateStatus: (response, result) => {
				// validate the response status
				return response.status === 200 && !result.IsError;
			},
			// keepUnusedDataFor: import.meta.env.VITE_NODE_ENV === "development" ? 5 : 60, // keep unused data for 5 seconds for development, the defualt is 60 seconds
			transformResponse: (response) => {
				// transform the response data, use for sorting, filtering, etc.
				const loadedNotes = response.map((note) => {
					note.id = note._id; // mongoose uses _id, redux toolkit uses id
					return note;
				});

				return notesAdapter.setAll(initialState, loadedNotes);
			},
			providesTags: (result, error, arg) => {
				// provide tags for the query, use for invalidating the query
				if (result?.ids) {
					return [
						{ type: "Note", id: "LIST" },
						...result.ids.map((id) => ({ type: "Note", id })),
					];
				} else {
					return [{ type: "Note", id: "LIST" }];
				}
			},
		}),
		addNewNote: builder.mutation({
			query: (data) => ({
				url: "/api/notes",
				method: "POST",
				body: {
					...data,
				},
			}),
			invalidateTags: [{ type: "Note", id: "LIST" }],
		}),
		updateNote: builder.mutation({
			query: (data) => ({
				url: `/api/notes/${data.id}`,
				method: "PATCH",
				body: {
					...data,
				},
			}),
			invalidateTags: (result, error, arg) => {
				return [{ type: "Note", id: arg.id }];
			},
		}),
		deleteNote: builder.mutation({
			query: ({ id }) => ({
				url: `/api/notes/${id}`,
				method: "DELETE",
			}),
			invalidateTags: (result, error, arg) => {
				return [{ type: "Note", id: arg.id }];
			},
		}),
	}),
});

export const {
	useGetNotesQuery,
	useAddNewNoteMutation,
	useUpdateNoteMutation,
	useDeleteNoteMutation,
} = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// create memoized selector
const selectNotesData = createSelector(
	selectNotesResult,
	(notesResult) => notesResult.data // normalized state object with ids and entities
);

// getSelectors creates these selectors and we rename them with aliases using  destructuring
export const {
	selectAll: selectAllNotes,
	selectById: selectNoteById,
	selectIds: selectNoteIds,
	// Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors((state) => selectNotesData(state) ?? initialState);
