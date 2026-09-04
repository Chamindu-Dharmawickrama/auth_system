import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth, registerCacheReset } from "@/services/baseQuery";
import type { ApiResponse } from "@/types/api.types";
import type {
   Note,
   CreateNoteRequest,
   UpdateNoteRequest,
} from "../types/notes.types";

export const notesApi = createApi({
   reducerPath: "notesApi",
   baseQuery: baseQueryWithReauth,
   tagTypes: ["Note"],
   endpoints: (build) => ({
      // get all notes
      getNotes: build.query<Note[], void>({
         query: () => "/notes/my-notes",
         // Transform response to unwrap the `data` envelope
         transformResponse: (response: ApiResponse<Note[]>) => response.data,

         // Provides a general 'LIST' tag, plus a tag for each individual note
         providesTags: (result) =>
            result
               ? [
                    ...result.map(({ id }) => ({ type: "Note" as const, id })),
                    { type: "Note", id: "LIST" },
                 ]
               : [{ type: "Note", id: "LIST" }],
      }),

      getAllNotes: build.query<Note[], void>({
         query: () => "/notes",
         transformResponse: (response: ApiResponse<Note[]>) => response.data,
         providesTags: (result) =>
            result
               ? [
                    ...result.map(({ id }) => ({ type: "Note" as const, id })),
                    { type: "Note", id: "LIST" },
                 ]
               : [{ type: "Note", id: "LIST" }],
      }),

      // create note
      createNote: build.mutation<Note, CreateNoteRequest>({
         query: (body) => ({ url: "/notes", method: "POST", body }),
         transformResponse: (response: ApiResponse<Note>) => response.data,
         //
         invalidatesTags: [{ type: "Note", id: "LIST" }],
      }),

      // Update note
      updateNote: build.mutation<Note, { id: string; body: UpdateNoteRequest }>(
         {
            query: ({ id, body }) => ({
               url: `/notes/${id}`,
               method: "PATCH",
               body,
            }),
            transformResponse: (response: ApiResponse<Note>) => response.data,
            // Invalidate the specific note and the list (to update previews)
            invalidatesTags: (result, error, { id }) => [
               { type: "Note", id },
               { type: "Note", id: "LIST" },
            ],
         },
      ),

      // Delete note
      deleteNote: build.mutation<void, string>({
         query: (id) => ({ url: `/notes/${id}`, method: "DELETE" }),
         invalidatesTags: (result, error, id) => [
            { type: "Note", id },
            { type: "Note", id: "LIST" },
         ],
      }),
   }),
});

export const {
   useGetNotesQuery,
   useGetAllNotesQuery,
   useCreateNoteMutation,
   useUpdateNoteMutation,
   useDeleteNoteMutation,
} = notesApi;

// Register this API's cache-reset callback with baseQuery so the 401-forced-logout
// path can wipe stale data without creating a circular import.
registerCacheReset((dispatch) => dispatch(notesApi.util.resetApiState()));

/*
1. User creates a note
       ↓
2. createNote mutation fires → POST /notes  (API request #1)
       ↓
3. Server responds with success 
       ↓
4. RTK Query sees invalidatesTags: [{ type: "Note", id: "LIST" }]
       ↓
5. RTK Query checks: "Who provided this tag?"
   → getNotes provided { type: "Note", id: "LIST" }
       ↓
6. RTK Query automatically fires → GET /notes  (API request #2)
       ↓
7. UI re-renders with the fresh list including the new note 
*/
