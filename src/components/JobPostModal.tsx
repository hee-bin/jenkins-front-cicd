"use client";

import React, { useState, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Textarea,
  ModalFooter,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { UserContext } from "@/app/providers";
import { JobPostAPI } from "@/app/admin/action";

const JobPostModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [questionCount, setQuestionCount] = useState(1);
  const { userData } = useContext(UserContext);
  const handleSubmit = async () => {
    const questionsObject: Record<string, string> = {};
    questions.forEach((question, index) => {
      questionsObject[(index + 1).toString()] = question;
    });

    const jobreqinfo = JSON.stringify({
      name: userData[0].name,
      title: title,
      text: text,
      questions: questionsObject,
    });

    const jobpost = await JobPostAPI(jobreqinfo);
    alert(jobpost);
    setTitle("");
    setText("");
    setQuestionCount(1);
    setQuestions([""]);
  };

  const handleAddQuestion = () => {
    setQuestionCount((prevCount) => prevCount + 1);
    setQuestions((prevQuestions) => [...prevQuestions, ""]);
  };

  const handleDeleteQuestion = () => {
    setQuestionCount((prevCount) => prevCount - 1);
    questions.pop();
  };

  return (
    <>
      <Button size="lg" variant="bordered" color="secondary" onPress={onOpen}>
        공고 등록하기
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <>
            <ModalHeader>공고 등록</ModalHeader>

            <ModalBody>
              공고 이름
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                  isRequired
                  key={"title"}
                  value={title}
                  placeholder="공고 제목 입력"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                공고내용
                <Textarea
                  isRequired
                  id="job_detail"
                  className="w-full"
                  minRows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="flex gap-5">
                  <p className="mt-4">자기소개서 질문</p>
                  <Button
                    color="secondary"
                    variant="bordered"
                    onClick={handleAddQuestion}
                    className="mt-2"
                  >
                    질문 추가
                  </Button>
                  <Button
                    color="danger"
                    variant="bordered"
                    onClick={handleDeleteQuestion}
                    className="mt-2"
                  >
                    질문 삭제
                  </Button>
                </div>
                {questions.map((question, index) => (
                  <Textarea
                    key={index}
                    isRequired
                    value={question}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    placeholder={`질문 ${index + 1}`}
                    className="mb-2"
                  />
                ))}
                <div className="flex justify-end mt-4">
                  <Button color="danger" variant="light" onPress={onClose}>
                    닫기
                  </Button>
                  <Button type="submit" color="primary">
                    등록
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JobPostModal;
