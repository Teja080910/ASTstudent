import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Stack,
} from "@chakra-ui/react";
import React from "react";

const TeamJoinModal = ({ isOpen, onClose, teamCode, setTeamCode, registrationNumber, setRegistrationNumber, password, setPassword, handleJoin }) => {

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleJoin();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join Hackathon</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Input
              placeholder="Team Code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Input
              placeholder="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleJoin}>
            Join
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TeamJoinModal;
