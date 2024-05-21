"use server";

export async function SignupAPI(memberReqInfo: string) {
  const API_URL = process.env.API_URL;

  // Create a Blob object with the JSON content type
  const blob = new Blob([memberReqInfo], { type: "application/json" });

  const formData = new FormData();
  formData.append("MemberReqInfo", blob);

  try {
    const response = await fetch(`${API_URL}/api/member`, {
      method: "POST",
      body: formData,
      // No headers should be manually set, let the browser handle it
    });

    // Handle response
    const responseData = await response.text();
    return "회원가입 성공! 로그인 페이지로 이동합니다.";
  } catch (error) {
    // Handle error
    console.error("Error:", error);
    return "회원가입에 실패했습니다. 고객센터에 문의해주세요.";
  }
}
