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
import { JobPassAPI } from "./action";

interface IApplicant {
  id: string;
  index: number;
  name: string;
  jobName: string;
  writeDate: string;
  answer: Record<string, string>;
  isPass: string;
}

interface IOpen {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onOpen: () => void;
  data: IApplicant;
  questions: Record<string, string> | undefined;
}

const CheckApplicantModal = ({
  isOpen,
  onOpenChange,
  data,
  questions,
}: IOpen) => {
  console.log(data.answer);
  console.log(questions);
  const handleSubmit = async () => {
    const applypassinfo = JSON.stringify({
      pass: "yes",
      index: data.index,
    });

    const applyResponse = await JobPassAPI(applypassinfo);
    alert(applyResponse);
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        <>
          <ModalHeader>{data.name}님의 자기소개서</ModalHeader>
          <ModalBody>
            {Object.entries(data.answer).map(([questionKey, answerText]) => (
              <div key={questionKey} className="mb-2">
                <label
                  htmlFor={`question-${questionKey}`}
                  className="block mb-1 font-bold"
                >
                  {questionKey}. {questions && questions[questionKey]}
                </label>
                <p>{answerText}</p>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <Button
                color="danger"
                variant="light"
                onClick={() => onOpenChange(false)}
              >
                닫기
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                합격
              </Button>
            </div>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};

export default CheckApplicantModal;
