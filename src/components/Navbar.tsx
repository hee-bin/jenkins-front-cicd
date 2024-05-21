"use client";

import { UserContext } from "@/app/providers";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import React, { useContext } from "react";

const Navigation = () => {
  const { userData, clearUserData } = useContext(UserContext);
  const router = useRouter();

  function onLoginButton() {
    router.push("/login");
  }

  function onLogoutButton() {
    clearUserData();
    router.push("/");
  }

  return (
    <>
      <Navbar position="static">
        <NavbarBrand>
          <Link href={userData[0]?.type === "admin" ? "/admin" : "/"}>
            <p className="font-bold text-xl">취Up하자</p>
          </Link>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem>
            {userData.length > 0 ? (
              <Button
                variant="bordered"
                color="primary"
                onClick={onLogoutButton}
              >
                로그아웃
              </Button>
            ) : (
              <Button
                variant="bordered"
                color="primary"
                onClick={onLoginButton}
              >
                로그인
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default Navigation;
