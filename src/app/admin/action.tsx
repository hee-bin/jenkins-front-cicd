"use server";

export async function JobPostAPI(jobReqInfo: string) {
  const API_URL = process.env.API_URL;

  const blob = new Blob([jobReqInfo], { type: "application/json" });

  const formData = new FormData();
  formData.append("JobReqInfo", blob);

  try {
    const response = await fetch(`${API_URL}/api/job`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.text();
    return "공고가 등록되었습니다.";
  } catch (error) {
    console.error("Error:", error);
    return "공고문을 한번 더 확인해주세요. ";
  }
}
