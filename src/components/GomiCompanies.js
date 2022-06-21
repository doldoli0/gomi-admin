import React from "react"
import {Pagination, Card, Button, Table, Badge, Row, Col, Form, InputGroup, Popover} from "react-bootstrap"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import CardHeaderMore from "./CardHeaderMore"
import Preloader from "./Preloader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
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

    return (
        <Card className="card-table h-100">
            <Card.Header>
                {/*<h5 className="card-heading">가맹점 목록</h5>*/}
                <Row>
                    <Col lg={1}>
                        <div className="d-grid gap-2">
                            <Button variant={'outline-info'} disabled={isLoading} onClick={handleReload}>
                                전체 초기화 <FontAwesomeIcon icon={faRecycle}/>
                            </Button>
                        </div>
                    </Col>
                    <Col lg={3}>
                        <Form onSubmit={onSubmitSingleCompanies}>
                            <InputGroup>
                                <Form.Select type="select" required name={'key'} disabled={isLoading}>
                                    <option value={'name'}>가맹점</option>
                                    <option value={'number'}>담당자 연락처</option>
                                    <option value={'admin'}>담당 사원</option>
                                </Form.Select>
                                <Form.Control type="text" name={'value'} required autoComplete="off" disabled={isLoading}/>
                                <Button type={'submit'} disabled={isLoading}>검색</Button>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>
                <Row className={'mt-2'}>
                    <Col lg={2}>
                        <InputGroup>
                            <InputGroup.Text>생성</InputGroup.Text>
                            <Form.Select type="select" disabled={isLoading} name={'created_by'} value={searchForm.created_by} onChange={onChangeSearchForm}>
                                <option value={''}>전체</option>
                                <option value={'admin'}>관리자</option>
                                <option value={'user'}>유저</option>
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col lg={2}>
                        <InputGroup>
                            <InputGroup.Text>분류</InputGroup.Text>
                            <Form.Select type="select" disabled={isLoading} name={'type'} value={searchForm.type} onChange={onChangeSearchForm}>
                                <option value={''}>전체</option>
                                <option value={'before_fee'}>기존 수수료 미확인</option>
                                <option value={'after_fee'}>확정 수수료 미확인</option>
                                {/*<option value={'status1'}>계약 대기</option>*/}
                                {/*<option value={'status2'}>계약 완료</option>*/}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col lg={2}>
                        <InputGroup>
                            <InputGroup.Text>상태</InputGroup.Text>
                            <Form.Select type="select" disabled={isLoading} name={'status'} value={searchForm.status} onChange={onChangeSearchForm}>
                                <option value={''}>보류중 아님</option>
                                <option value={0}>검토중</option>
                                <option value={1}>계약 대기</option>
                                <option value={2}>계약 완료</option>
                                <option value={3}>보류중</option>
                                {/*<option value={'status1'}>계약 대기</option>*/}
                                {/*<option value={'status2'}>계약 완료</option>*/}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col lg={3}>
                        <InputGroup>
                            <InputGroup.Text>검색</InputGroup.Text>
                            <Form.Select type="select" disabled={isLoading} name={'condition'} value={searchForm.condition} onChange={onChangeSearchForm}>
                                <option value={'sales'}>연매출</option>
                                <option value={'before_fee'}>기존 수수료</option>
                                <option value={'after_fee'}>확정 수수료</option>
                            </Form.Select>
                            <Form.Control type={'number'} disabled={isLoading} name={'condition_value'} value={searchForm.condition_value} onChange={onChangeSearchForm}/>
                            <Button variant={searchForm.condition_sign === '>='?'danger':'outline-danger'} disabled={isLoading} onClick={() => onClickConditionSign('>=')}>이상</Button>
                            <Button variant={searchForm.condition_sign === '<='?'info':'outline-info'} disabled={isLoading} onClick={() => onClickConditionSign('<=')}>이하</Button>
                        </InputGroup>
                    </Col>
                    <Col lg={1}>
                        <div className="d-grid gap-2">
                            <Button variant={'outline-secondary'} onClick={() => handleSearchCompanies(1)} disabled={isLoading}>
                                검색 <FontAwesomeIcon icon={faSearch}/>
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
                        <th>가맹점</th>
                        <th>담당 사원</th>
                        <th>연 매출</th>
                        <th>기존 수수료</th>
                        <th>확정 수수료</th>
                        <th>담당자 연락처</th>
                        <th className={'text-end'}>다음 일정</th>
                        <th className={'text-end'}>생성 일자</th>
                        <th className={'text-end'}>상태</th>
                    </tr>
                    </thead>
                    {isLoaded && !isLoading ?
                        <tbody className="align-middle">
                        {data.map((item, index) => {
                            let variant,message, bgClass
                            let created, createdVariant;

                            if (item.created_by === 'admin') {
                                created = '관리자';
                                createdVariant = 'primary'
                            }
                            else {
                                created = '유저';
                                createdVariant = 'success'
                            }

                            switch (item.status) {
                                case 0:
                                    variant = "secondary"
                                    message = '검토중'
                                    bgClass = CompanyStyle.status0
                                    break
                                case 1:
                                    variant = "info"
                                    message = '계약 대기'
                                    bgClass = CompanyStyle.status1
                                    break
                                case 2:
                                    variant = "success"
                                    message = '계약 완료'
                                    bgClass = CompanyStyle.status2
                                    break
                                default:
                                    variant = "danger"
                                    message = '보류'
                                    bgClass = CompanyStyle.status3
                            }


                            const memoPopover = (
                                <Popover id="popover-basic">
                                    {/*<Popover.Header as="h3">업체 메모</Popover.Header>*/}
                                    <Popover.Body>
                                        {item.memo || ''}
                                    </Popover.Body>
                                </Popover>
                            );

                            const schedulePopover = (
                                <Popover id="popover-basic">
                                    <Popover.Header as="h3">
                                        {item.user && <strong>{item.user.name}</strong>}
                                    </Popover.Header>
                                    <Popover.Body>
                                        {item.schedule_comment || ''}
                                    </Popover.Body>
                                </Popover>
                            );

                            return (
                                <tr key={index} className={bgClass}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <OverlayTrigger placement={'right'} overlay={memoPopover}>
                                                <span className="d-inline-block">
                                                    <Link href={`/companies/${item.id}`}>
                                                        <a className="text-reset text-decoration-none  d-flex align-items-center">
                                                            <Badge bg={createdVariant}>{created}</Badge>
                                                            <strong style={{marginLeft: '5px'}}>{item.name}</strong>
                                                        </a>
                                                    </Link>
                                                    {/*<br/>*/}
                                                    {/*<span className="text-muted text-sm">{item.place}</span>*/}
                                                </span>

                                            </OverlayTrigger>
                                        </div>
                                    </td>
                                    <td>
                                        {item.user && <strong>{item.user.name}</strong>}
                                    </td>
                                    <td>{item.sales.toLocaleString()}억</td>
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
                                    <td className={'text-end'}>
                                        {item.schedule?
                                            <OverlayTrigger placement={'right'} overlay={schedulePopover}>
                                                <strong>
                                                    <Moment format={'YYYY-MM-DD HH:mm'}>{item.schedule}</Moment>
                                                </strong>
                                            </OverlayTrigger>
                                            :
                                            <span>없음</span>
                                        }
                                    </td>
                                    <td className={'text-end'}>
                                        <Moment format={'YYYY-MM-DD HH:mm'}>{item.created_at}</Moment>
                                    </td>
                                    <td className={'text-end'}>
                                        <Badge bg={variant + "-light"} text={variant}>
                                            {message}
                                        </Badge>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                        :
                        <tbody>
                        <tr>
                            <td colSpan={9} align={'center'}>
                                {isLoading ?
                                    <Preloader type={"wandering-cubes"} variant={'warning'}/>
                                    :
                                    <Button onClick={handleReload} disabled={isLoading}>
                                        다시 시도 <FontAwesomeIcon icon={faRecycle}/>
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
                        <Button onClick={handleCreateModalShow}>가맹점 추가</Button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    )
}
