import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState({});

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: () => "/api/users",
			validateStatus: (response, result) => {
				// validate the response status
				return response.status === 200 && !result.IsError;
			},
			// keepUnusedDataFor: import.meta.env.VITE_MODE === "dev" ? 5 : 60, // keep unused data for 5 seconds for development, the defualt is 60 seconds
			transformResponse: (responseData) => {
				// transform the response data, use for sorting, filtering, etc.

				// convert mongoose _id to id
				const loadedUsers = responseData.map((user) => {
					user.id = user._id;
					return user;
				});

				return usersAdapter.setAll(initialState, loadedUsers);
			},
			providesTags: (result, error, arg) => {
				// provide tags for the query, use for invalidating the query

				if (result?.ids) {
					return [
						{ type: "User", id: "LIST" },
						...result.ids.map((id) => ({ type: "User", id })),
					];
				} else {
					return [{ type: "User", id: "LIST" }];
				}
			},
		}),
		addNewUser: builder.mutation({
			query: (data) => ({
				url: "/api/users",
				method: "POST",
				body: {
					...data,
				},
			}),
			invalidateTags: [{ type: "User", id: "LIST" }],
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: `/api/users/${data.id}`,
				method: "PATCH",
				body: {
					...data,
				},
			}),
			invalidateTags: (result, error, arg) => {
				return [{ type: "User", id: arg.id }];
			},
		}),
		deleteUser: builder.mutation({
			query: ({ id }) => {
				console.log("delete user", { id });

				return {
					url: `/api/users/${id}`,
					method: "DELETE",
				};
			},
			invalidateTags: (result, error, arg) => {
				return [{ type: "User", id: arg.id }];
			},
		}),
	}),
});

export const {
	useGetUsersQuery,
	useAddNewUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// create memoized selector
const selectUsersData = createSelector(
	selectUsersResult,
	(usersResult) => usersResult.data // normalized state object with ids and entities
);

// getSelectors creates these selectors and we rename them with aliases using  destructuring
export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds,
	// Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
