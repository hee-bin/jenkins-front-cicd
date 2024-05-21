"use client";

import React, { useState, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Textarea,
} from "@nextui-org/react";
import { UserContext } from "@/app/providers";
import { JobApplyAPI } from "./action";

interface IJob {
  id: string;
  index: number;
  title: string;
  name: string;
  writeDate: string;
  updateDate: string;
  text: string;
  questions: Record<string, string>;
}

interface IOpen {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onOpen: () => void;
  data: IJob;
}

const JobApplyModal = ({ isOpen, onOpenChange, data }: IOpen) => {
  const { userData } = useContext(UserContext);
  const [responses, setResponses] = useState<Record<string, string>>(
    Object.keys(data.questions).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, string>)
  );

  const handleResponseChange = (questionKey: string, response: string) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionKey]: response,
    }));
  };

  const handleSubmit = async () => {
    const applyreqinfo = JSON.stringify({
      name: userData[0].name,
      answer: responses,
      isPass: "none",
      jobName: data.title,
    });
    const applyResponse = await JobApplyAPI(applyreqinfo);
    alert(applyResponse);
    onOpenChange(false);
    setResponses({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      size="5xl"
    >
      <ModalContent>
        <>
          <ModalHeader>{data.title}</ModalHeader>
          <ModalBody>
            <p>{data.text}</p>

            {Object.entries(data.questions).map(
              ([questionKey, questionText]) => (
                <div key={questionKey} className="mb-2">
                  <label
                    htmlFor={`question-${questionKey}`}
                    className="block mb-1"
                  >
                    {questionText}
                  </label>
                  <Textarea
                    id={`question-${questionKey}`}
                    className="w-full"
                    minRows={5}
                    value={responses[questionKey]}
                    onChange={(e) =>
                      handleResponseChange(questionKey, e.target.value)
                    }
                  />
                </div>
              )
            )}
            <div className="flex justify-end mt-4">
              <Button
                color="danger"
                variant="light"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                Apply
              </Button>
            </div>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};

export default JobApplyModal;
