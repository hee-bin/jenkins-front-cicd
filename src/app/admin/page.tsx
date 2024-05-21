"use client";
import useSWR from "swr";
import React from "react";
import { Card } from "@nextui-org/react";
import JobPostModal from "@/components/JobPostModal";
import { getJobList } from "../action";
import { useRouter } from "next/navigation";

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

const page = () => {
  const router = useRouter();
  const { data: jobList, error, isLoading } = useSWR("getJobList", getJobList);

  const handleCardClick = (jobId: number) => {
    router.push(`admin/job/${jobId}`);
  };

  if (isLoading) return <p>데이터 가져오는 중입니다! 잠시만 기다려주세요</p>;
  if (error) return <p>서버와의 연결을 실패했습니다.</p>;
  return (
    <div className="flex flex-col items-center gap-5 min-h-screen">
      <JobPostModal />
      <div className="text-3xl font-bold text-blue-700">공고 목록</div>
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobList.map((job: IJob) => (
          <Card
            key={job.index}
            className="p-4 border-3 border-blue-400 hover:shadow-xl transition-shadow duration-300"
            isPressable
            shadow="none"
            onPress={() => handleCardClick(job.index)}
          >
            <div className="font-bold text-lg mb-2">{job.title}</div>
            <p className="text-gray-800">{job.text}</p>
            <p className="text-gray-600 text-sm">
              {new Date(job.writeDate).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
