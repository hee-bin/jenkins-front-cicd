"use server";

export async function getJobList() {
  const API_URL = process.env.API_URL;
  const res = await fetch(`${API_URL}/api/job`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const jobList = res.json();
  //console.log(jobList);
  return jobList;
}

export async function getApplicantList(title: string) {
  const API_URL = process.env.API_URL;

  const applynameinfo = JSON.stringify({
    name: title,
  });

  const blob = new Blob([applynameinfo], { type: "application/json" });

  const formData = new FormData();
  formData.append("ApplyNameInfo", blob);

  try {
    const response = await fetch(`${API_URL}/api/apply/job`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    return "지원자가 아직 없습니다. ";
  }
}
