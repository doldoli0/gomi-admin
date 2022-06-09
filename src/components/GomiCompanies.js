import React from "react"

import {Card, Button, Table, Badge} from "react-bootstrap"
import CardHeaderMore from "./CardHeaderMore"
import Preloader from "./Preloader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleDown, faBackward, faRecycle, faRedo, faTruckLoading} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function GomiCompanies({
                                          data,
                                          lightHeader,
                                          handleCreateModalShow,
                                          isLoaded,
                                          isLoading,
                                          handleReload
                                      }) {
    return (
        <Card className="card-table h-100">
            <Card.Header>
                <h5 className="card-heading">회사 목록</h5>
                <div className="card-header-more">
                    <Button disabled={isLoading} onClick={handleReload}>
                        <FontAwesomeIcon icon={faRedo} className="me-2 opacity-5"/>
                        Reload
                    </Button>
                </div>
                {/*<CardHeaderMore/>*/}
            </Card.Header>
            <Card.Body>
                <Table responsive hover className="mb-0">
                    <thead className={lightHeader ? "light" : ""}>
                    <tr>
                        <th>회사명</th>
                        <th>연 매출</th>
                        <th>기존 수수료</th>
                        <th>확정 수수료</th>
                        <th>담당자 연락처</th>
                        <th className={'text-end'}>상태</th>
                    </tr>
                    </thead>
                    {isLoaded ?
                        <tbody className="align-middle">
                        {data.map((item, index) => {
                            let variant
                            let message
                            switch (item.status) {
                                case 0:
                                    variant = "secondary"
                                    message = '검토중'
                                    break
                                case 1:
                                    variant = "info"
                                    message = '계약 대기'
                                    break
                                case 2:
                                    variant = "success"
                                    message = '계약 완료'
                                    break
                                default:
                                    variant = "danger"
                                    message = '보류'
                            }
                            return (
                                <tr key={index}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <span className="d-inline-block">
                                            <Link
                                                href={`/company/${item.id}`}
                                            >
                                                <a className="text-reset text-decoration-none  d-flex align-items-center">
                                                    <strong>{item.name}</strong>
                                                </a>
                                            </Link>
                                            {/*<br/>*/}
                                            {/*<span className="text-muted text-sm">{item.place}</span>*/}
                                      </span>
                                        </div>
                                    </td>
                                    <td>{item.sales.toLocaleString()}억</td>
                                    <td>{item.before_fee && `${item.before_fee.toLocaleString()}%`}</td>
                                    <td>
                                        {item.after_fee &&
                                            <div>
                                                {item.after_fee.toLocaleString()}%{` `}
                                                {item.before_fee > item.after_fee ?
                                                    <Badge
                                                        bg="success">{(item.after_fee - item.before_fee).toFixed(3)}%</Badge>
                                                    :
                                                    item.before_fee < item.after_fee ?
                                                        <Badge
                                                            bg="danger">{(item.before_fee - item.after_fee).toFixed(3)}%</Badge>
                                                        :
                                                        null
                                                }
                                            </div>
                                        }
                                    </td>
                                    <td>{item.number}</td>
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
                            <td colSpan={6} align={'center'}>
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
            <Card.Footer className="text-end">
                <Button onClick={handleCreateModalShow}>회사 추가</Button>
            </Card.Footer>
        </Card>
    )
}
