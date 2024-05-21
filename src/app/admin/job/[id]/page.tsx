"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { getApplicantList } from "@/app/action";
import { useParams } from "next/navigation";
import { getJobInfo } from "./action";
import { Card, useDisclosure } from "@nextui-org/react";
import CheckApplicantModal from "@/components/CheckApplicantModal";
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

interface IApplicant {
  id: string;
  index: number;
  name: string;
  jobName: string;
  writeDate: string;
  answer: Record<string, string>;
  isPass: string;
}

const page = () => {
  const params = useParams<{ id: string }>();
  const [jobInfo, setJobInfo] = useState<IJob>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedApplicant, setSelectedApplicant] = useState<IApplicant | null>(
    null
  );
  const [applicantList, setApplicantList] = useState<IApplicant[]>([]);

  useEffect(() => {
    const fetchJobInfo = async () => {
      const jobinfo = await getJobInfo(params.id);
      //console.log(jobinfo);
      setJobInfo(jobinfo);
      const applicantlist = await getApplicantList(jobinfo.title);
      setApplicantList(applicantlist);
    };

    fetchJobInfo();
  }, []);

  const handleCardClick = (applicant: IApplicant) => {
    setSelectedApplicant(applicant); // Set the selected job
    onOpen();
    // Open the modal
  };

  return (
    <main className="flex flex-col items-center justify-center gap-3">
      <div className="text-3xl font-bold">공고 정보</div>
      {jobInfo ? (
        <>
          <div className="font-bold text-lg mb-2">{jobInfo.title}</div>
          <p className="text-gray-800">{jobInfo.text}</p>
          <p className="text-gray-600 text-sm">
            {new Date(jobInfo.writeDate).toLocaleString()}
          </p>
        </>
      ) : (
        <></>
      )}
      <div className="text-3xl font-bold">지원자</div>
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applicantList?.map((applicant: IApplicant) => (
          <Card
            key={applicant.id}
            className="p-4 border-3 border-blue-400 hover:shadow-xl transition-shadow duration-300"
            isPressable
            shadow="none"
            onPress={() => handleCardClick(applicant)}
          >
            <div className="font-bold text-lg mb-2">{applicant.name}</div>
            <p>합격 여부: {applicant.isPass}</p>
            <p className="text-gray-600 text-sm">
              {new Date(applicant.writeDate).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
      {selectedApplicant && (
        <CheckApplicantModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          data={selectedApplicant}
          questions={jobInfo?.questions}
        />
      )}
    </main>
  );
};

export default page;
