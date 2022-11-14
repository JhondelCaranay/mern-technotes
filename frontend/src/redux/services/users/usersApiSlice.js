import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({
	// selectId: (user) => user._id, // selectId - A function that selects the ID from a single entity. Defaults to (entity) => entity.id
	//sortComparer: (a, b) => a.username.localeCompare(b.username), // sortComparer - A function that compares two entities and returns a number indicating which should come first. Defaults to (a, b) => a.id.localeCompare(b.id)
});
// createEntityAdapter() - A utility that generates a set of reducer and selector functions that know how to update the normalized cache state for a particular entity type. It accepts an options object with the following fields:

const initialState = usersAdapter.getInitialState({});

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: () => "/api/users",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.IsError;
				// validateStatus - A function that can be used to validate the response status code. If the function returns false, the query will be rejected with an error. Defaults to checking if the status code is between 200 and 299.
			},
			// keepUnusedDataFor: import.meta.env.VITE_MODE === "dev" ? 5 : 60,
			// keepUnusedDataFor - The number of seconds to keep unused data in the cache. Defaults to 60 seconds.
			transformResponse: (responseData) => {
				// transformResponse - A function that can be used to transform the response data before it is passed to the reducer. This is useful for normalizing the data, or converting it to a different format.
				// transformResponse - can also be use for sorting the data and filtering the data before it is passed to the reducer.

				// convert mongoose _id to id
				const loadedUsers = responseData.map((user) => {
					user.id = user._id;
					return user;
				});

				return usersAdapter.setAll(initialState, loadedUsers);

				// transformResponse is need when you using createEntityAdapter() to normalize the data.
			},
			providesTags: (result, error, arg) => {
				// providesTags - An array of tags that this query provides. These tags are used to determine which queries to refetch when a mutation is dispatched. If this is not provided, the query will not be refetched when a mutation is dispatched.
				// provide tags for the query, use for invalidating the query

				if (result?.ids) {
					return [
						{ type: "User", id: "LIST" },
						...result.ids.map((id) => ({ type: "User", id })),
					];
				} else {
					return [{ type: "User", id: "LIST" }];
				}

				// LIST - is a special tag that is used to invalidate all queries that provide it. This is useful for invalidating a list of items when a new item is added.
				// ...result.ids.map((id) => ({ type: "User", id })) - cache individual user
				// { type: "User", id: "LIST" } -  cache all users
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
// usersApiSlice.endpoints.getUsers.select() - returns the query result object

// create memoized selector
const selectUsersData = createSelector(
	selectUsersResult,
	(usersResult) => usersResult.data // normalized state object with ids and entities
);

// createSelector - accepts an input function an an output function. The input function is called with the current state, and the output function is called with the result of the input function. The output function is only called if the result of the input function has changed.

// getSelectors creates these selectors and we rename them with aliases using  destructuring
export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds,
	selectEntities: selectUserEntities,
	selectTotal: selectTotalUsers,
	// Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
// getSelectors - Returns a set of selector functions that know how to read the normalized cache state for a particular entity type. It accepts an options object with the following fields:
// selectId - A function that selects the ID value from an entity object. Defaults to assuming that the ID is a field called "id".
// sortComparer - A function that can be used to sort the entities by ID. Defaults to sorting by numeric ID.

// createSelector - A utility that accepts an input selector and one or more "transform" functions as input, and returns a new selector function. The new selector will call the input selector with its arguments, and then call each "transform" function in order, passing the result of the previous function call as the first argument. The final result of the last "transform" function call will be returned as the result of the new selector.

// getSelectors - A utility that generates a set of memoized selector functions for the normalized cache state for a particular entity type. It accepts an options object with the following fields:

// createEntityAdapter CRUD Functions

// addOne - Adds a new entity to the state, and returns the new state.
// addMany - Adds several new entities to the state, and returns the new state.
// setAll - Replaces all entities in the state, and returns the new state.
// setOne - Updates an entity in the state, and returns the new state.
// setMany - Replaces the specified entities in the state, and returns the new state.
// removeOne - Removes an entity from the state, and returns the new state.
// removeMany - Removes several entities from the state, and returns the new state.
// removeAll - Removes all entities from the state, and returns the new state.
// updateOne - Updates an entity in the state, and returns the new state.
// updateMany - Updates several entities in the state, and returns the new state.
// upsertOne - Adds a new entity to the state if it does not exist, or updates it if it does, and returns the new state.
// upsertMany - Adds several new entities to the state if they do not exist, or updates them if they do, and returns the new state.

// Selector Functions
// selectAll - Returns an array of all the entities in the state, sorted by their IDs.
// selectById - Returns the entity with the given ID from the state, or undefined if it does not exist.
// selectIds - Returns an array of all the IDs in the state, sorted numerically.
// selectTotal - Returns the total number of entities in the state.

// selectIds - A selector function that selects the IDs array from the normalized cache state. Defaults to using the selectIds function from createEntityAdapter.
// selectEntities - A selector function that selects the entities lookup table from the normalized cache state. Defaults to using the selectEntities function from createEntityAdapter.
// selectAll - A selector function that selects the array of all entities from the normalized cache state. Defaults to using the selectAll function from createEntityAdapter.
// selectTotal - A selector function that selects the total number of entities from the normalized cache state. Defaults to using the selectTotal function from createEntityAdapter.
// selectById - A selector function that selects a single entity by ID from the normalized cache state. Defaults to using the selectById function from createEntityAdapter.
