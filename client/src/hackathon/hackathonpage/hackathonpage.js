import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Stack,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import Logout from "@mui/icons-material/Logout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Actions } from "../../actions/actions";
import Chat from "../../services/chatting/Chat";
import DisplayTimer from "../timers/displayTimer";
import "./hackathonpage.css";
import TeamJoinModal from "./joinhackathonmodal";
import TechTeamList from "./techteamlist";
import Galley from './gallery.jpeg'
import TaskCard from "./taskCard";

export const Hackathonpage = ({route, isAuth = false, socket }) => {
  const nav = useNavigate();
  document.title = "Hackathon | Team AST";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [teamCode, setTeamCode] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [TechTeamData, setTechTeamData] = useState([]);

  const teamcode = useSelector((state) => state.user?.TeamCode);
  const teamname = useSelector((state) => state.user?.TeamName);
  const member = useSelector((state) => state.user?.TeamMember);
  const RoundData = useSelector((state) => state.user?.TeamData);
  const [tasks, setTasks] = useState(Object.values(RoundData?.Rounds || {}));

  const dispatch = useDispatch();
  const handleJoin = async () => {
    try {
      const response = await Actions.JoinHackathon(
        teamCode,
        registrationNumber,
        password,
        false
      );
      if (response?.data?.error) {
        toast({
          title: "Error joining team.",
          description: response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        dispatch({
          type: "JOINHACK",
          payload: {
            TeamCode: response?.data?.data?.TeamCode,
            TeamPassword: response?.data?.data?.Password,
            TeamMember: registrationNumber,
            TeamName: response?.data?.data?.Team,
            TeamData: response?.data?.data,
          },
        });
        onClose();
        setTasks(Object.values(response?.data?.data?.Rounds || {}));
        toast({
          title: "Team joined.",
          description: "You have successfully joined the team.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error joining team.",
        description: error.message || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    dispatch({
      type: "JOINHACK",
      payload: {
        TeamCode: "",
        TeamPassword: "",
        TeamMember: "",
        TeamData: "",
      },
    });
    window.location.reload();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await Actions.TeamMembers();
      setTechTeamData(res?.data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Failed to fetch team members.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Center p={8} className="hackathon-container">
      <DisplayTimer socket={socket} />
      <TechTeamList techTeamData={TechTeamData} />
      <Stack spacing={8} maxW="5xl" w="full">
        <div className="text-center">
          {!isAuth && (
            <Button className="join-button" onClick={onOpen}>
              Join Hackathon
            </Button>
          )}
          {isAuth && (
            <>
              <Button
                className="join-button"
                onClick={() => (window.location.href = "/games")}
              >
                Games
              </Button>
              {route?.gallery&&<Button backgroundImage={Galley} onClick={()=>nav('/gallery')}>Show Gallery</Button>}
              <Button onClick={handleLogout} colorScheme="red">
                <Logout />
              </Button>
            </>
          )}
        </div>
        <div>
          {isAuth && (
       <TaskCard RoundData={RoundData}/>
          )}
          {isAuth &&
            tasks.sort().map((task, index) => (
              <Card key={index} className="task-card">
                <CardHeader className="task-header">
                  <Heading
                    textAlign="center"
                    fontSize="2xl"
                    className="task-title-color"
                  >
                    Round {index + 1}: {task.Task}
                  </Heading>
                </CardHeader>
                <CardBody className="task-body">
                  <Text className="task-content">{task.Desc}</Text>
                </CardBody>
              </Card>
            ))}
        </div>
      </Stack>
      {isAuth && (
        <Chat
          socket={socket}
          teamId={teamcode}
          participantId={member}
          teamname={teamname}
        />
      )}
      <TeamJoinModal
        isOpen={isOpen}
        onClose={onClose}
        teamCode={teamCode}
        setTeamCode={setTeamCode}
        registrationNumber={registrationNumber}
        setRegistrationNumber={setRegistrationNumber}
        password={password}
        setPassword={setPassword}
        handleJoin={handleJoin}
      />
    </Center>
  );
};

export default Hackathonpage;
