import 'bootstrap/dist/css/bootstrap.min.css';

import {Col, Container, Row, Card, CardGroup, InputGroup, FormControl, ListGroup, Button} from "react-bootstrap";
import {useCallback, useEffect, useState} from "react";
import {fromJS, List, Map} from "immutable";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";

const ApexCharts = dynamic( () => import('react-apexcharts'), { ssr: false } );

export async function getStaticProps() {
    return {
        props: {
            title: "수수료 비교",
            pageHolderClass: `page-holder align-items-center py-4 vh-100 bg-gray-100`,
            hideHeader: true,
            hideFooter: true,
            hideSidebar: true,
        },
    }
}

export default function Cal() {
    const { query } = useRouter();
    const {before_fee, after_fee, sales} = query;

    const numbers = [1,3,6,12];
    const chartY = [1, 3, 6, 12, 24];

    const [formData, setFormData] = useState(Map({sales:'', before_fee:'', after_fee:''}));
    const [monthlySales, setMonthlySales] = useState(0);
    const [beforeMonthlyFee, setBeforeMonthlyFee] = useState(0);
    const [afterMonthlyFee, setAfterMonthlyFee] = useState(0);
    const [submitEnable, setSubmitEnable] = useState(true);
    const [chartData, setChartData] = useState(fromJS({
        series: [{
            name: '적용 수수료',
            data: []
        }, {
            name: '기존 수수료',
            data: []
        }, {
            name: '수수료 차액',
            data: []
        }],
        options: {
            chart: {
                type: 'bar',
                height: 430
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        position: 'top',
                    },
                },
            },
            dataLabels: {
                enabled: true,
                offsetX: -6,
                style: {
                    fontSize: '12px',
                    colors: ['#fff']
                },
                formatter: function (val) {
                    return val.toLocaleString();
                }
            },
            stroke: {
                show: true,
                width: 1,
                colors: ['#fff']
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (val) {
                        return val.toLocaleString();
                    }
                },
            },
            xaxis: {
                categories: chartY.map(y => (`${y}개월`)),
                labels: {
                    formatter: function (value) {
                        return value.toLocaleString();
                    }
                },
            },
        },
    }));

    useEffect(() => {
        setFormData(formData.set('before_fee', before_fee>0?before_fee:'').set('after_fee', after_fee>0?after_fee:'').set('sales', sales>0?sales:''))
        // before_fee && setFormData(formData.set('before_fee', before_fee));
        // after_fee && setFormData(formData.set('after_fee', after_fee));
        // sales && setFormData(formData.set('sales', sales));
        // setFormData(formData.set('before_fee', before_fee).set('after_fee', after_fee).set('sales', sales));
        // if (before_fee && after_fee && sales) {
        //     onSubmitForm();
        // }
    }, [query])

    useEffect(() => {
        if (formData.get('sales') > 0 && formData.get('before_fee') > 0 && formData.get('after_fee') > 0) {
            setSubmitEnable(false);
        }
        else {
            setSubmitEnable(true);
        }
    }, [formData])

    const onChangeFormData = (e) => {
        setFormData(formData.set(e.target.name, e.target.value));
    }

    const onSubmitForm = () => {
        // const data = {
        //     sales : sales?sales:formData.get('sales'),
        //     before_fee : before_fee?before_fee:formData.get('before_fee'),
        //     after_fee : after_fee?after_fee:formData.get('after_fee')
        // }

        if (formData.get('sales') > 0 && formData.get('before_fee') > 0 && formData.get('after_fee') > 0) {
            const monthly_sales = formData.get('sales') * 100000000 / 12;
            const before_monthly_fee = monthly_sales * formData.get('before_fee') / 100;
            const after_monthly_fee = monthly_sales * formData.get('after_fee') / 100;
            setMonthlySales(monthly_sales);
            setBeforeMonthlyFee(before_monthly_fee);
            setAfterMonthlyFee(after_monthly_fee);
            setChartData(chartData.setIn(['series', 0, 'data'], chartY.map(number => (number * after_monthly_fee).toFixed()))
                .setIn(['series', 1, 'data'], chartY.map(number => (number * before_monthly_fee).toFixed()))
                .setIn(['series', 2, 'data'], chartY.map(number => (number * before_monthly_fee - number * after_monthly_fee).toFixed()))
            );
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col sm={12} md={3}>
                    <InputGroup className="mb-3" size={'sm'}>
                        <InputGroup.Text id="form1">연매출</InputGroup.Text>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="form1"
                            name={'sales'}
                            value={formData.get('sales')}
                            onChange={onChangeFormData}
                        />
                        <InputGroup.Text>억</InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col sm={12} md={3}>
                    <InputGroup className="mb-3" size={'sm'}>
                        <InputGroup.Text id="form2">기존 수수료</InputGroup.Text>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="form2"
                            name={'before_fee'}
                            value={formData.get('before_fee')}
                            onChange={onChangeFormData}
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col sm={12} md={3}>
                    <InputGroup className="mb-3" size={'sm'}>
                        <InputGroup.Text id="form3">적용 수수료</InputGroup.Text>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="form3"
                            name={'after_fee'}
                            value={formData.get('after_fee')}
                            onChange={onChangeFormData}
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col sm={12} md={3}>
                    <div className="d-grid gap-2">
                        <Button variant={'primary'} onClick={onSubmitForm} className={'bt'} disabled={submitEnable}>
                            적용
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row>
                {numbers.map((number, index) => {
                    const before_monthly_fee = beforeMonthlyFee * number;
                    const after_monthly_fee = afterMonthlyFee * number;


                    return (
                        <Col key={index} sm={12} md={3}>
                            <Card style={{width: '100%'}}>
                                <Card.Header className={'text-center bg-primary bg-opacity-10'}>
                                    {number}개월
                                </Card.Header>
                                <Card.Body>
                                    {/*<Card.Text>*/}
                                    <p><span className="d-inline-block bg-danger rounded-circle p-1"/> 기존 수수료 : {before_monthly_fee.toLocaleString(undefined, {maximumFractionDigits: 0})}
                                    </p>
                                    <p><span className="d-inline-block bg-primary rounded-circle p-1"/> 적용 수수료 : {after_monthly_fee.toLocaleString(undefined, {maximumFractionDigits: 0})}
                                    </p>
                                    {/*<ListGroup variant="flush">*/}
                                    {/*    <ListGroup.Item>*/}
                                    {/*        <span className="d-inline-block bg-danger rounded-circle p-1"/> 기존 수수료*/}
                                    {/*        : {before_monthly_fee.toLocaleString(undefined, {maximumFractionDigits: 0})}*/}
                                    {/*    </ListGroup.Item>*/}
                                    {/*    <ListGroup.Item>*/}
                                    {/*        <span className="d-inline-block bg-primary rounded-circle p-1"/> 적용 수수료*/}
                                    {/*        : {after_monthly_fee.toLocaleString(undefined, {maximumFractionDigits: 0})}*/}
                                    {/*    </ListGroup.Item>*/}
                                    {/*</ListGroup>*/}
                                    {/*</Card.Text>*/}
                                    <p>
                                        <span className="d-inline-block bg-success rounded-circle p-1"/> 수수료 차액 : <span
                                        className={'text-danger fw-bold'}>{(before_monthly_fee - after_monthly_fee).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                                    </p>
                                    {/*<Card.Footer>*/}
                                    {/*    <span className="d-inline-block bg-success rounded-circle p-1"/> 수수료 차액 : <span*/}
                                    {/*    className={'text-danger fw-bold'}>{(before_monthly_fee - after_monthly_fee).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>*/}
                                    {/*</Card.Footer>*/}
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
            <Row>
                <Col sm={12} md={12}>
                    {chartData.size !== 0 &&
                        <ApexCharts options={chartData.get('options').toJS()} series={chartData.get('series').toJS()} type="bar" height={'500'}/>
                    }
                </Col>
            </Row>
        </Container>
    )
}
