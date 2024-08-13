import { Badge, Box, Button, Card, CardBody, CardHeader, Heading, Input, Spinner, Stack, StackDivider, Text, Tooltip, useToast } from "@chakra-ui/react";
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Actions } from "../../actions/actions";
import { HackathonNav } from "../hackathonnav/hackathonnav";
import './ps.css';

export const ProblemStatements = ({ data, reload }) => {
    const [dat, setDat] = useState([]);
    const [stmt, setStmt] = useState(true)
    const [select, setSelect] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(2)
    const [my, setMy] = useState(false)
    const teamcode = useSelector((state) => state.user?.Teamcode)
    const toast = useToast();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchTasks();
        // CountPss()
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.post(process.env.REACT_APP_Server + '/statements?teamcode=' + teamcode);
            setIsLoading(false)
            if (response.data.message === "No problem statements available") {
                setDat([]);
            } else {
                setDat(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // const CountPss = async () => {
    //     await Actions.PSSC()
    //         .then((res) => {
    //             if (res?.data?.data?.Members && res?.data?.data?.Statements) {
    //                 setCount((res?.data?.data?.Members / res?.data?.data?.Statements).toFixed(0))
    //             } else {
    //                 setCount('')
    //             }
    //         }).catch((e) => console.log(e))
    // }

    const SelectPS = async (number, stmt, desc) => {
        setStmt(false)
        await Actions.SelectPS(teamcode, number, stmt, desc)
            .then((res) => {
                if (res?.data?.message) {
                    fetchTasks();
                    setStmt(true)
                    reload()
                    toast({ title: res?.data?.message, status: 'success', position: 'top-right', isClosable: true })
                }
                if (res?.data?.error) {
                    setStmt(true)
                    toast({ title: res?.data?.error, status: 'error', position: 'bottom-right', isClosable: true })
                }
            })
            .catch((e) => {
                setStmt(true)
                toast({ title: e?.message, status: 'error', position: 'bottom-right', isClosable: true })
            })
    }

    const UnSelectPS = async (number) => {
        setStmt(false)
        await Actions.UnSelectPS(teamcode, number)
            .then((res) => {
                if (res?.data?.message) {
                    fetchTasks();
                    setStmt(true)
                    reload()
                    toast({ title: res?.data?.message, status: 'success', position: 'top-right', isClosable: true })
                }
                if (res?.data?.error) {
                    setStmt(true)
                    toast({ title: res?.data?.error, status: 'error', position: 'bottom-right', isClosable: true })
                }
            })
            .catch((e) => {
                setStmt(true)
                toast({ title: e?.message, status: 'error', position: 'bottom-right', isClosable: true })
            })
    }

    const checkStmt = (number) => {
        return dat.some(ps => ps?.Number === number && ps?.Users?.some(val => val.includes(teamcode)));
    };

    const SelectedStmt = (user) => {
        return dat.map(student => (student?.TeamCode === user && student?.PS?.Statement));
    }

    const handleLogOut = () => {
        dispatch({
            type: "TEAM",
            payload: {
                Teamcode: "",
                Teamname: "",
            },
        });
        window.location.reload();
    }

    return (
        <>
            <HackathonNav />
            <Box display="flex" justifyContent="center" mb={6}>
                {my || <Input id="search" value={select} placeholder="Enter problem statement name or number" onChange={(e) => setSelect(e.target.value)} width="70%" />}
                <Button colorScheme="red" onClick={handleLogOut}>
                    <Tooltip label="Logout">
                        <LogoutIcon />
                    </Tooltip>
                </Button>
            </Box>
            {
                isLoading ?
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <Spinner size="xl" />
                    </Box>
                    :
                    <div className="problemstatements">
                        <div className="task-form">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', margin: '2% 0%' }}>
                                {my || <Button bg="#3AA6B9" onClick={() => setSelect('sports')}>Sports</Button>}
                                {my || <Button bg="#3AA6B9" onClick={() => setSelect('yoga')}>Yoga</Button>}
                                <Button bg="#3AA6B9" onClick={() => { setMy(my ? false : true); setSelect("") }}>{my ? "View all statements" : "My Statement"}</Button>
                            </div>
                            <Box mt={8}>
                                <div className='task-box'>
                                    <h1 className='h1-tasks'>{my ? "My " : "All Available "}Problem Statements</h1>
                                    {dat && dat?.filter(val =>
                                        (val?.Theme?.toLowerCase().includes(select) ||
                                            val?.Number?.includes(select) ||
                                            val?.Desc?.toLowerCase().includes(select) ||
                                            val?.Statement?.toLowerCase().includes(select)))?.map((task) => (
                                        !my ? (task?.Users?.length || 0)<=2 && !task?.Users?.includes(teamcode) &&<Card m={2}>
                                            <CardHeader>
                                                <Heading size='md'>Problem Statement Number : {task?.Number}</Heading>
                                                <Badge colorScheme={task.Theme === "sports" ? "blue" : "green"}>{task?.Theme}</Badge>
                                            </CardHeader>
                                            <CardBody>
                                                <Stack divider={<StackDivider />} spacing='4'>
                                                    <Box>
                                                        <Heading size='xs' textTransform='uppercase'>
                                                            {task?.Statement}
                                                        </Heading>
                                                        <Text pt='2' fontSize='sm'>
                                                            {task?.Desc}
                                                        </Text>
                                                        {/* {stmt && <Text textAlign={'center'}>
                                                            {!checkStmt(task?.Number)? <Button onClick={() => SelectPS(task?.Number, task?.Statement, task?.Desc)}>select</Button>:
                                                            <Button onClick={() => UnSelectPS(task?.Number)}>unselect</Button>}
                                                        </Text>} */}
                                                        {stmt && <Text textAlign={'center'}>
                                                            {!data?.PS ? <Button colorScheme="green" onClick={() => { SelectPS(task?.Number, task?.Statement, task?.Desc) }}>select</Button> :
                                                                data?.PS?.Number === task?.Number && <Button colorScheme="red" onClick={() => { UnSelectPS(task?.Number) }}>unselect</Button>}
                                                        </Text>}
                                                    </Box>
                                                </Stack>
                                            </CardBody>
                                        </Card>
                                            : task?.Number && task?.Users?.includes(parseInt(teamcode)) && <Card>
                                                <CardHeader>
                                                    <Heading size='md'>Problem Statement Number {task?.Number}</Heading>
                                                </CardHeader>
                                                <CardBody>
                                                    <Stack divider={<StackDivider />} spacing='4'>
                                                        <Box>
                                                            <Heading size='xs' textTransform='uppercase'>
                                                                {task?.Statement}
                                                            </Heading>
                                                            <Text pt='2' fontSize='sm'>
                                                                {task?.Desc}
                                                            </Text>
                                                            {/* {stmt && <Text textAlign={'center'}>
                                                        {!checkStmt(task?.Number)? <Button onClick={() => SelectPS(task?.Number, task?.Statement, task?.Desc)}>select</Button>:
                                                        <Button onClick={() => UnSelectPS(task?.Number)}>unselect</Button>}
                                                    </Text>} */}
                                                            {stmt && <Text textAlign={'center'}>
                                                                {!data?.PS ? <Button colorScheme="green" onClick={() => { SelectPS(task?.Number, task?.Statement, task?.Desc) }}>select</Button> :
                                                                    data?.PS?.Number === task?.Number && <Button colorScheme="red" onClick={() => { UnSelectPS(task?.Number) }}>unselect</Button>}
                                                            </Text>}
                                                        </Box>
                                                    </Stack>
                                                </CardBody>
                                            </Card>
                                    ))}
                                </div>
                            </Box>
                        </div>
                    </div>}
        </>
    );
};