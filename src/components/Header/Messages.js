import React from "react"
import {Dropdown, NavItem, NavLink, Spinner} from "react-bootstrap"
import Icon from "../Icon"
import Avatar from "../Avatar"
import Preloader from "../Preloader";
import Link from "next/link";

export default function Messages({messages, onClickMessage}) {
    // const messages = [
    //   {
    //     name: "Jason Doe",
    //   },
    //   {
    //     name: "Frank Williams",
    //   },
    //   {
    //     name: "Ashley Wood",
    //   },
    // ]


    if (messages.isLoading) {
        return (
            <Preloader type="pulse" variant="secondary"/>
        )
    }
    return (
        <Dropdown as={NavItem} className="me-2 me-lg-3" align="end">
            <Dropdown.Toggle
                as={NavLink}
                className="text-gray-400 px-1 nav-link-icon"
                id="messages"
            >
                <Icon icon="paper-plane-1" className="svg-icon-md svg-icon-heavy"/>
                <span className="notification-badge notification-badge-number bg-primary">
          {messages.data.length}
        </span>
            </Dropdown.Toggle>
            <Dropdown.Menu
                data-bs-popper="none"
                className="text-sm dropdown-menu-animated"
                aria-labelledby="messages"
            >
                {messages.data.map((message, index) => {
                    let actionUser;
                    if (message.action_user) {
                        actionUser = message.action_user.name;
                    }
                    else {
                        actionUser = 'System';
                    }

                    let category, link;
                    switch (message.action) {
                        case 'company':
                            category = '대리점';
                            link = `/companies/${message.action_id}`;
                            break;
                        case 'schedule':
                            category = '일정';
                            link = `/`;
                            break;
                        default:
                            category = '';
                            link = `/user/messages`;
                    }

                    return (
                        <Dropdown.Item
                            key={index}
                            className="d-flex align-items-center p-3"
                            onClick={() => {onClickMessage(index)}}
                        >
                            {/*<Avatar*/}
                            {/*  image={message.avatar}*/}
                            {/*  alt={message.name}*/}
                            {/*  className="me-2"*/}
                            {/*  size="sm"*/}
                            {/*  border*/}
                            {/*/>*/}

                            <div className="pt-1">
                                <h6 className={`fw-bold mb-0`}>{actionUser}</h6>
                                <div className={`text-muted text-sm text-${message.color}`}>{category} {message.message}</div>
                            </div>
                        </Dropdown.Item>
                    )
                })}

                <Dropdown.Divider/>
                <Dropdown.Item className="text-center" href="#">
                    <Link href={'/user/messages'}>
                        <small className="fw-bold text-uppercase">View all messages</small>
                    </Link>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
