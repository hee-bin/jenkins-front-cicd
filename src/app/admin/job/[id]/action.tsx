"use server";

export async function getJobInfo(id: string) {
  const API_URL = process.env.API_URL;
  const res = await fetch(`${API_URL}/api/job/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const jobInfo = await res.json();
  //console.log(jobInfo);
  return jobInfo;
}
