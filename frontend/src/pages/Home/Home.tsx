import { Modal } from "@/components/UI/Modal";
import { SearchBar } from "./components/SearchBar";
import { WordList } from "./components/WordList";
import { WordInput } from "./components/WordInput";
import { Pagination } from "./components/Pagination";
import { WordEditForm } from "./components/WordEditForm";
import { useHomeLogic } from "./hooks/useHomeLogic";

export const Home: React.FC = () => {
   const {
      searchTerm,
      sortOption,
      currentPage,
      editingWord,
      isModalOpen,
      wordsData,
      isLoading,
      error,
      handleSearch,
      handleSort,
      handlePageChange,
      handleEditWord,
      handleCloseModal,
   } = useHomeLogic();

   return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
         <h1 className="text-3xl font-bold mb-8 text-center">
            Mini Vokabeltrainer
         </h1>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
               <WordInput />
            </div>

            <div className="md:col-span-2">
               <div className="bg-white p-6 rounded-lg shadow-md">
                  <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />

                  <WordList
                     words={wordsData?.data || []}
                     loading={isLoading}
                     error={error}
                     editWord={handleEditWord}
                     onSort={handleSort}
                     sortOption={sortOption}
                  />

                  <Pagination
                     currentPage={currentPage}
                     totalPages={wordsData?.totalPages || 1}
                     onPageChange={handlePageChange}
                  />
               </div>
            </div>
         </div>

         <Modal isOpen={isModalOpen} setOpen={handleCloseModal}>
            <WordEditForm word={editingWord} setOpen={handleCloseModal} />
         </Modal>
      </div>
   );
};
