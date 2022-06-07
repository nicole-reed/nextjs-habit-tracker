import React from 'react'
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmation = ({ showModal, hideModal, confirmModal, habitid, message }) => {
    return (
        <Modal show={showModal} onHide={hideModal}>

            <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
            <Modal.Footer>
                <Button variant="default" onClick={hideModal}>
                    Cancel
          </Button>
                <Button className='delete-btn' variant="danger" onClick={() => confirmModal(habitid)}>
                    Delete
          </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteConfirmation;
