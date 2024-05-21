"use server";

export async function JobApplyAPI(applyReqInfo: string) {
  const API_URL = process.env.API_URL;

  const blob = new Blob([applyReqInfo], { type: "application/json" });

  const formData = new FormData();
  formData.append("ApplyReqInfo", blob);

  try {
    const response = await fetch(`${API_URL}/api/apply`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.text();
    console.log(`responseData: ${responseData}`);
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    return "지원에 실패했습니다. 고객센터 통해서 연락 부탁드립니다.";
  }
}

export async function JobPassAPI(applypassinfo: string) {
  const API_URL = process.env.API_URL;

  const blob = new Blob([applypassinfo], { type: "application/json" });

  const formData = new FormData();
  formData.append("ApplyPassInfo", blob);

  try {
    const response = await fetch(`${API_URL}/api/apply`, {
      method: "PUT",
      body: formData,
    });

    const responseData = await response.text();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    return "변경에 실패했습니다. 고객센터 통해서 연락 부탁드립니다.";
  }
}
