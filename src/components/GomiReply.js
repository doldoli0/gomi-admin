import React from "react"
import { faPaperPlane, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {Button, Card, Form, FormCheck, InputGroup, ListGroup, Spinner} from "react-bootstrap"
import Moment from 'react-moment';

import Avatar from "./Avatar"
import LoadingButton from "./LoadingButton";
export default function GomiReply({ replies, messageInput, onChangeMessage, onSubmitMessage, isLoading, messageRef }) {
  return (
    <Card className="overflow-hidden mb-1">
      <Card.Header>
          <Form onSubmit={onSubmitMessage}>
              <InputGroup>
                  <Form.Control ref={messageRef} type="text" placeholder="Message" value={messageInput} onChange={onChangeMessage}
                                disabled={isLoading} required/>
                  {/*<LoadingButton*/}
                  {/*    label={<FontAwesomeIcon icon={faPaperPlane}/>}*/}
                  {/*    actionType="expand-right"*/}
                  {/*    className="mb-1 me-1"*/}
                  {/*    loading={isLoading}*/}
                  {/*/>*/}
                  <Button variant={'outline-primary'} disabled={isLoading} type={'submit'}>
                      {isLoading ?
                          <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                          />
                          :
                          <FontAwesomeIcon icon={faPaperPlane}/>
                      }
                  </Button>
              </InputGroup>
          </Form>
      </Card.Header>
      <ListGroup className="rounded-0">
        {replies.map((reply, index) => (
          <ListGroup.Item
            className="border-start-0 border-end-0 py-3 border-top-0"
            key={index}
          >
            <div className="d-flex">
              {/*<div className="flex-shrink-0">*/}
              {/*  <Avatar*/}
              {/*    image={profile.img}*/}
              {/*    alt={profile.name}*/}
              {/*    size="lg"*/}
              {/*    border*/}
              {/*  />*/}
              {/*</div>*/}
              <div className="flex-grow-1 ps-3">
                  <small className="float-right"><Moment format={'MM??? DD??? HH??? m??? s???'}>{reply.created_at}</Moment></small>
                <h5 className={`fw-bold ${reply.color && `text-${reply.color}`}`}>{reply.comment}</h5>
                <div className="text-muted text-sm">{reply.user.name}</div>
                {/*{reply.replies &&*/}
                {/*    reply.replies.map((reply, replyIndex) => (*/}
                {/*    <div className="d-flex mt-4" key={replyIndex}>*/}
                {/*      <div className="flex-shrink-0">*/}
                {/*        <Avatar image={reply.img} alt={reply.author} border />*/}
                {/*      </div>*/}
                {/*      <div className="flex-grow-1 ps-3 text-sm text-muted">*/}
                {/*        <strong className="text-dark">{reply.author}: </strong>*/}
                {/*        {reply.text}*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  ))}*/}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  )
}
