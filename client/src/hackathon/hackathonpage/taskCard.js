import React, { useState } from "react";
import { Card, CardHeader, CardBody, Heading, Text, Button } from "@chakra-ui/react";

function TaskCard({ RoundData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const description = RoundData?.PS?.Desc || "";
  const truncatedDescription = description.length > 250 ? description.slice(0, 250) + "..." : description;

  return (
    <Card key="ps" className="task-card">
      <CardHeader className="task-header">
        <Heading
          textAlign="center"
          fontSize="2xl"
          className="task-title-color"
        >
          Title: {RoundData?.PS?.Number} - {RoundData?.PS?.Statement}
        </Heading>
      </CardHeader>
      <CardBody className="task-body">
        <Text className="task-content" as="p">
          {isExpanded ? description : truncatedDescription}
        </Text>
        {description.length > 100 && (
          <Button onClick={toggleReadMore} variant="link" mt={2} colorScheme="purple" fontSize={20}>
            {isExpanded ? "Read Less" : "Read More"}
          </Button>
        )}
      </CardBody>
    </Card>
  );
}

export default TaskCard;
