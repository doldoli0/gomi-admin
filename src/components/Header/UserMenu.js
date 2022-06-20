import React from "react"
import { Dropdown, NavItem, NavLink } from "react-bootstrap"
import Link from "next/link"
import Avatar from "../Avatar"
import {signIn, signOut} from "next-auth/react";
import {useDispatch, useSelector} from "react-redux";
import {requestLogout} from "../../store/modules/user";
import {useRouter} from "next/router";
import style from "../../styles/custom.module.css";

export default function UserMenu() {
    const router = useRouter();
    const {name, position} = useSelector((state) => state.user.data);

    const dispatch = useDispatch();
    const onClickLogout = async () => {
        dispatch(requestLogout());
        router.push('/login');
    }


  return (
    <Dropdown as={NavItem} className="ms-auto" align="end">
      <Dropdown.Toggle as={NavLink} className="pe-0" id="userInfo">
          <div className={style.circle}>
              {name && name.charAt(0)}
          </div>
        {/*<Avatar image="/img/avatar-6.jpg" alt="Jason Doe" border priority />*/}
      </Dropdown.Toggle>
      <Dropdown.Menu
        className="dropdown-menu-animated"
        aria-labelledby="userInfo"
        data-bs-popper="none"
      >
        <Dropdown.Header className="text-gray-700">
          <h6 className="text-uppercase font-weight-bold">{name}</h6>
          <small>{position}</small>
        </Dropdown.Header>
        <Dropdown.Divider />
        <Dropdown.Item href="#">Settings</Dropdown.Item>
        <Dropdown.Item>Activity log </Dropdown.Item>
        <Dropdown.Divider />
      <Dropdown.Item onClick={onClickLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
