import React from "react"
import {Pagination, Card, Button, Table, Badge, Row, Col, Form, InputGroup, Popover} from "react-bootstrap"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import CardHeaderMore from "./CardHeaderMore"
import Preloader from "./Preloader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAddressBook,
    faArrowAltCircleDown, faArrowLeft,
    faBackward,
    faRecycle,
    faRedo,
    faReply, faSearch,
    faTruckLoading
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CompanyStyle from '../styles/company.module.css';
import Moment from "react-moment";
import {toast} from "react-toastify";

export default function GomiCompanies({
                                          data,
                                          lightHeader,
                                          handleCreateModalShow,
                                          isLoaded,
                                          isLoading,
                                          handleReload,
                                          onSubmitSingleCompanies,
                                          onChangeSearchForm,
                                          searchForm,
                                          onClickConditionSign,
                                          handleSearchCompanies,
                                          lastPage,
                                          currentPage,
                                          onClickPage
                                      }) {

    let pageItems = [];
    for (let number = 1; number <= lastPage; number++) {
        pageItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => onClickPage(number)} disabled={isLoading}>
                {number}
            </Pagination.Item>
        );
    }



    const onClickPost = async (text) => {
        try {
            await navigator.clipboard.writeText(text);

            toast.success('??????????????? ?????? ????????????.');
        } catch (error) {
            toast.error('??????????????? ???????????? ????????????.');
        }
    }

    return (
        <Card className="card-table h-100">
            <Card.Header>
                {/*<h5 className="card-heading">????????? ??????</h5>*/}
                <Row>
                    <Col lg={1}>
                        <div className="gap-2 d-grid">
                            <Button variant={'outline-info'} disabled={isLoading} onClick={handleReload}>
                                <FontAwesomeIcon icon={faRedo}/> Reset
                            </Button>
                        </div>
                    </Col>
                    <Col lg={3}>
                        <Form onSubmit={onSubmitSingleCompanies}>
                            <InputGroup>
                                <Form.Select type="select" required name={'key'} disabled={isLoading}>
                                    <option value={'name'}>?????????</option>
                                    <option value={'number'}>????????? ?????????</option>
                                    <option value={'admin'}>?????? ??????</option>
                                </Form.Select>
                                <Form.Control type="text" name={'value'} required autoComplete="off" disabled={isLoading}/>
                                <Button type={'submit'} disabled={isLoading}>??????</Button>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>
                <Row className={'mt-2'}>
                    <Col lg={2}>
                        <InputGroup>
                            <InputGroup.Text>??????</InputGroup.Text>
                            <Form.Select type="select" disabled={isLoading} name={'created_by'} value={searchForm.created_by} onChange={onChangeSearchForm}>
                                <option value={''}>??????</option>
                                <option value={'admin'}>?????????</option>
                                <option value={'user'}>??????</option>
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col lg={2}>
                        <InputGroup>
                            <InputGroup.Text>??????</InputGroup.Text>
                            <Form.Select type="select" disabled={isLoading} name={'type'} value={searchForm.type} onChange={onChangeSearchForm}>
                                <option value={''}>??????</option>
                                <option value={'before_fee'}>?????? ????????? ?????????</option>
                                <option value={'after_fee'}>?????? ????????? ?????????</option>
                                {/*<option value={'status1'}>?????? ??????</option>*/}
                                {/*<option value={'status2'}>?????? ??????</option>*/}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col lg={2}>
                        <InputGroup>
                            <InputGroup.Text>??????</InputGroup.Text>
                            <Form.Select type="select" disabled={isLoading} name={'status'} value={searchForm.status} onChange={onChangeSearchForm}>
                                <option value={''}>????????? ??????</option>
                                <option value={0}>?????????</option>
                                <option value={1}>?????? ??????</option>
                                <option value={2}>?????? ??????</option>
                                <option value={3}>?????????</option>
                                {/*<option value={'status1'}>?????? ??????</option>*/}
                                {/*<option value={'status2'}>?????? ??????</option>*/}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col lg={3}>
                        <InputGroup>
                            <InputGroup.Text>??????</InputGroup.Text>
                            <Form.Select type="select" disabled={isLoading} name={'condition'} value={searchForm.condition} onChange={onChangeSearchForm}>
                                <option value={'sales'}>?????????</option>
                                <option value={'before_fee'}>?????? ?????????</option>
                                <option value={'after_fee'}>?????? ?????????</option>
                            </Form.Select>
                            <Form.Control type={'number'} disabled={isLoading} name={'condition_value'} value={searchForm.condition_value} onChange={onChangeSearchForm}/>
                            <Button variant={searchForm.condition_sign === '>='?'danger':'outline-danger'} disabled={isLoading} onClick={() => onClickConditionSign('>=')}>??????</Button>
                            <Button variant={searchForm.condition_sign === '<='?'info':'outline-info'} disabled={isLoading} onClick={() => onClickConditionSign('<=')}>??????</Button>
                        </InputGroup>
                    </Col>
                    <Col lg={1}>
                        <div className="d-grid gap-2">
                            <Button variant={'outline-secondary'} onClick={() => handleSearchCompanies(1)} disabled={isLoading}>
                                ?????? <FontAwesomeIcon icon={faSearch}/>
                            </Button>
                        </div>
                    </Col>
                </Row>
                {/*<div className="card-header-more">*/}
                {/*    <Button disabled={isLoading} onClick={handleReload}>*/}
                {/*        <FontAwesomeIcon icon={faRedo} className="me-2 opacity-5"/>*/}
                {/*        Reload*/}
                {/*    </Button>*/}
                {/*</div>*/}
                {/*<CardHeaderMore/>*/}
            </Card.Header>
            <Card.Body>
                <Table responsive hover className="mb-0">
                    <thead className={lightHeader ? "light" : ""}>
                    <tr>
                        <th>?????????</th>
                        <th>??? ??????</th>
                        <th>?????? ?????????</th>
                        <th>?????? ?????????</th>
                        <th>????????? ?????????</th>
                        <th>?????? ??????</th>
                        {/*<th className={'text-end'}>?????? ??????</th>*/}
                        <th className={'text-end'}>?????? ??????</th>
                        <th className={'text-end'}>??????</th>
                    </tr>
                    </thead>
                    {isLoaded && !isLoading ?
                        <tbody className="align-middle">
                        {data.map((item, index) => {
                            let variant,message, bgClass
                            let created, createdVariant;

                            if (item.created_by === 'admin') {
                                created = '?????????';
                                createdVariant = 'primary'
                            }
                            else {
                                created = '??????';
                                createdVariant = 'success'
                            }

                            switch (item.status) {
                                case 0:
                                    variant = "secondary"
                                    message = '?????????'
                                    bgClass = CompanyStyle.status0
                                    break
                                case 1:
                                    variant = "info"
                                    message = '?????? ??????'
                                    bgClass = CompanyStyle.status1
                                    break
                                case 2:
                                    variant = "success"
                                    message = '?????? ??????'
                                    bgClass = CompanyStyle.status2
                                    break
                                default:
                                    variant = "danger"
                                    message = '??????'
                                    bgClass = CompanyStyle.status3
                            }


                            const memoPopover = (
                                <Popover>
                                    <Popover.Header as="h3">?????? ??????</Popover.Header>
                                    <Popover.Body style={{whiteSpace:'pre-wrap'}}>
                                        {item.memo || ''}
                                    </Popover.Body>
                                </Popover>
                            );

                            const postPopover = (
                                <Popover>
                                    <Popover.Header as="h3">??????</Popover.Header>
                                    <Popover.Body>
                                        {item.post &&
                                            <span>{item.post} {item.post_detail}</span>
                                        }
                                    </Popover.Body>
                                </Popover>
                            );

                            // const schedulePopover = (
                            //     <Popover id="popover-basic">
                            //         <Popover.Header as="h3">
                            //             {item.user && <strong>{item.user.name}</strong>}
                            //         </Popover.Header>
                            //         <Popover.Body>
                            //             {item.schedule_comment || ''}
                            //         </Popover.Body>
                            //     </Popover>
                            // );

                            return (
                                <tr key={index} className={bgClass}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <OverlayTrigger placement={'left'} overlay={postPopover}>
                                                <Button variant={'outline-dark'} size={'sm'} onClick={() => onClickPost(item.post)}>?????? ?????? <FontAwesomeIcon icon={faAddressBook}/></Button>
                                            </OverlayTrigger>
                                            <Link href={`/companies/${item.id}`}>
                                                <a className="text-reset text-decoration-none  d-flex align-items-center">
                                                    <OverlayTrigger placement={'right'} overlay={memoPopover}>
                                                            <strong style={{marginLeft: '5px'}}>{item.name}</strong>
                                                    </OverlayTrigger>
                                                </a>
                                            </Link>
                                            {/*<br/>*/}
                                            {/*<span className="text-muted text-sm">{item.place}</span>*/}
                                        </div>
                                    </td>
                                    <td>{item.sales.toLocaleString()}???</td>
                                    <td>{item.before_fee && `${item.before_fee.toLocaleString()}%`}</td>
                                    <td>
                                        {item.after_fee &&
                                            <div>
                                                {item.after_fee.toLocaleString()}%{` `}
                                                <Badge bg={item.before_fee >= item.after_fee?'secondary':'danger'}>{(item.after_fee - item.before_fee).toFixed(3)}%</Badge>
                                            </div>
                                        }
                                    </td>
                                    <td>{item.number}</td>
                                    <td>
                                        {item.user && <strong>{item.user.name}</strong>}
                                    </td>
                                    {/*<td className={'text-end'}>*/}
                                    {/*    {item.schedule?*/}
                                    {/*        <OverlayTrigger placement={'right'} overlay={schedulePopover}>*/}
                                    {/*            <strong>*/}
                                    {/*                <Moment format={'YYYY-MM-DD HH:mm'}>{item.schedule}</Moment>*/}
                                    {/*            </strong>*/}
                                    {/*        </OverlayTrigger>*/}
                                    {/*        :*/}
                                    {/*        <span>??????</span>*/}
                                    {/*    }*/}
                                    {/*</td>*/}
                                    <td className={'text-end'}>
                                        <Badge bg={createdVariant}>{created}</Badge>
                                        <Moment format={'YYYY-MM-DD HH:mm'}>{item.created_at}</Moment>
                                    </td>
                                    <td className={'text-end'}>
                                        <h5>
                                            <Badge bg={variant + "-light"} text={variant}>
                                                {message}
                                            </Badge>
                                        </h5>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                        :
                        <tbody>
                        <tr>
                            <td colSpan={8} align={'center'}>
                                {isLoading ?
                                    <Preloader type={"wandering-cubes"} variant={'warning'}/>
                                    :
                                    <Button onClick={handleReload} disabled={isLoading}>
                                        ?????? ?????? <FontAwesomeIcon icon={faRecycle}/>
                                    </Button>
                                }

                            </td>
                        </tr>
                        </tbody>
                    }

                </Table>
            </Card.Body>
            <Card.Footer className={'text-end'}>
                <Row>
                    <Col>
                        <Pagination>
                            {pageItems}
                        </Pagination>
                    </Col>
                    <Col>
                        <Button onClick={handleCreateModalShow}>????????? ??????</Button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    )
}
