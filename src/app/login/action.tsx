"use server";

export async function LoginAPI(loginReqInfo: string) {
  const API_URL = process.env.API_URL;

  console.log(loginReqInfo);

  const blob = new Blob([loginReqInfo], { type: "application/json" });

  const formData = new FormData();
  formData.append("LoginReqInfo", blob);

  try {
    const response = await fetch(`${API_URL}/api/member/login`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.text();
    console.log(`responseData: ${responseData}`);
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    return "아이디 비밀번호를 확인해주세요.";
  }
}

interface FullUserData {
  id: string;
  index: number;
  email: string;
  password: string;
  name: string;
  type: string;
  birthday: string;
  gpa: string;
  school: string;
  date: string;
}

interface UserData {
  index: number;
  email: string;
  name: string;
  type: string;
  birthday: string;
  gpa: string;
  school: string;
}

export async function UserAPI(email: string) {
  const API_URL = process.env.API_URL;

  const emailReqInfo = JSON.stringify({
    email: email as string,
  });

  const blob = new Blob([emailReqInfo], { type: "application/json" });

  const newFormData = new FormData();
  newFormData.append("EmailReqInfo", blob);

  try {
    const response = await fetch(`${API_URL}/api/member/email`, {
      method: "POST",
      body: newFormData,
    });

    const responseText = await response.text();
    console.log(`responseText: ${responseText}`);

    // Parse the JSON text into an array of FullUserData objects
    const responseData: FullUserData[] = JSON.parse(responseText);

    // Filter the data to only include the properties you need
    const filteredData: UserData[] = responseData.map(
      ({ index, email, name, type, birthday, gpa, school }): UserData => ({
        index,
        email,
        name,
        type,
        birthday,
        gpa,
        school,
      })
    );

    console.log(filteredData);
    return filteredData;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
