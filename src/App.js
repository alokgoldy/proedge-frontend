import React, { useState } from 'react';
import './App.css';
import { 
  Spinner,
  Input,
  Stack,
  VStack,
  HStack,
  IconButton,
  useColorMode,
  Heading,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  TableCaption,
  StackDivider,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
 } from "@chakra-ui/react";
import { FiMoon, FiSearch, FiSun } from 'react-icons/fi';



function App() {

  const { colorMode, toggleColorMode } = useColorMode();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState([]);

  const getResult = async (value) => {
    setLoading(true);

    if(value==='')
    {
      setError(true);
      setLoading(false);
      return
    }
    var data = await fetch('https://proedge-backend.herokuapp.com/result/'+value,{
      method:"GET",
      headers: {"Content-type":"application/json"}
    })
    data = await data.json();

    data.sort((a, b) => {
      if (a.rollNo < b.rollNo) return -1
      return a.rollNo > b.rollNo ? 1 : 0
    })
    setResult(data);
    setLoading(false);
  }
  return (
    <div className="App">
      <VStack>
        {error&&<Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Input Box Is Empty Add Comma Separated Roll No</AlertTitle>
          <CloseButton position="absolute" right="8px" top="8px" onClick={()=> setError(false)} />
        </Alert>}
        <IconButton
          aria-label="Toggle Dark Mode"
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          m="8"
          size="md"
          alignSelf="flex-end"
          onClick={toggleColorMode}
        />
        <Heading mb="8" size="xl">
          Search Results
        </Heading>
        <HStack>
        <Input
          type="text"
          placeholder="Enter roll numbers"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <IconButton
          aria-label="Search Result"
          icon={<FiSearch />}
          onClick={() => {
            setValue("");
            getResult(value);
          }}
        >
          Search
        </IconButton>
      </HStack>
      <Stack>
        {loading && (
          <>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </>
        )}
      </Stack>
      {result.length!==0 && (
          <>
              <VStack
                divider={<StackDivider />}
                borderColor="gray.100"
                borderWidth="2px"
                p="4"
                borderRadius="lg"
                w="100%"
                maxW={{ base: '90vw', sm: '80vw', lg: '50vw', xl: '40vw' }}
                alignItems="stretch"
              >
              <Table variant="simple">
                <TableCaption>Results of Given Roll Numbers</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Roll No</Th>
                    <Th textAlign="right">Result</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {result.map((res)=> {
                    return(
                      <Tr>
                        <Td >{res.rollNo}</Td>
                        <Td textAlign="right">{res.result}</Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </VStack>
          </>
        )}
      </VStack>
    </div>
  );
}

export default App;
