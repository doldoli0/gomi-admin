import React from "react"

import {Card, Button, Table, Badge} from "react-bootstrap"
import CardHeaderMore from "./CardHeaderMore"

export default function GomiCompanies({data, lightHeader, handleCreateModalShow}) {
    return (
        <Card className="card-table h-100">
            <Card.Header>
                <h5 className="card-heading">회사 목록</h5>
                <CardHeaderMore/>
            </Card.Header>
            <Card.Body>
                <Table responsive hover className="mb-0">
                    <thead className={lightHeader ? "light" : ""}>
                    <tr>
                        <th>회사명</th>
                        <th>연 매출</th>
                        <th>기존 수수료</th>
                        <th>확정 수수료</th>
                        <th className="text-end">상태</th>
                    </tr>
                    </thead>
                    <tbody className="align-middle">
                    {data.map((item, index) => {
                        let variant
                        switch (item.status) {
                            case "대기":
                                variant = "secondary"
                                break
                            case "기존":
                                variant = "warning"
                                break
                            case "확정":
                                variant = "info"
                                break
                            case "완료":
                                variant = "danger"
                                break
                            default:
                                variant = "success"
                        }
                        return (
                            <tr key={index}>
                                <td>
                                    <div className="d-flex align-items-center">
                                      <span className="d-inline-block">
                                        <strong>{item.name}</strong>
                                        <br/>
                                        <span className="text-muted text-sm">{item.place}</span>
                                      </span>
                                    </div>
                                </td>
                                <td>{item.sales.toLocaleString()}억</td>
                                <td>{item.before_fee.toLocaleString()}%</td>
                                <td>{item.after_fee.toLocaleString()}%{' '}
                                    {item.before_fee > item.after_fee?
                                        <Badge bg="success">{(item.after_fee - item.before_fee).toFixed(3)}</Badge>
                                        :
                                        item.before_fee < item.after_fee?
                                            <Badge bg="danger">{(item.before_fee - item.after_fee).toFixed(3)}</Badge>
                                            :
                                            null
                                    }
                                </td>
                                <td className="text-end">
                                    <Badge bg={variant + "-light"} text={variant}>
                                        {item.status}
                                    </Badge>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </Card.Body>
            <Card.Footer className="text-end">
                <Button onClick={handleCreateModalShow}>회사 추가</Button>
            </Card.Footer>
        </Card>
    )
}
