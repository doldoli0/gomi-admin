import React from "react"
import { Dropdown, NavItem, NavLink } from "react-bootstrap"
import Icon from "../Icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faEnvelope, faTools, faUpload} from "@fortawesome/free-solid-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
export default function GomiTools() {
  return (
    <a href={'/cal'} target={'_blank'}>
        <NavItem className="text-gray-400 px-1 nav-link-icon" >
            <Icon icon="sales-up-1" className="svg-icon-md svg-icon-heavy" />
        </NavItem>
    </a>
  )
}
