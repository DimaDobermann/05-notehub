import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes, createNote, deleteNote } from "./services/noteService";
import type { NoteTag } from "./types/note";

import NoteList from "./components/NoteList/NoteList";
import SearchBox from "./components/SearchBox/SearchBox";
import Pagination from "./components/Pagination/Pagination";
import Modal from "./components/Modal/Modal";
import NoteForm from "./components/NoteForm/NoteForm";

import css from "./App.module.css";

function App() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    handleSearch(value);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (note: { title: string; content: string; tag: NoteTag }) =>
      createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}

      {isError && (
        <p>
          Error loading notes:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}

      {notes.length > 0 && (
        <NoteList notes={notes} onDelete={(id) => deleteMutation.mutate(id)} />
      )}

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={(values) => createMutation.mutate(values)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
