import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DeleteModal = ({ showModal, setShowModal, handleDelete, deleteText }) => {
  return (
    <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to delete {deleteText}
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDelete}>
              Yes, I'm Sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No, Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
