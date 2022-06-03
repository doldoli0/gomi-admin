import { Container, Row, Col, Card, Badge } from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faServer,
    faDollyFlatbed,
    faReceipt,
    faClipboardCheck,
    faDollarSign,
    faUserFriends,
    faClipboard
} from "@fortawesome/free-solid-svg-icons"
import Pill from "../components/Pill"
import GomiCompanies from "../components/GomiCompanies";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    changeInput,
    requestCreateCompany,
    requestGetCompanies,
    setAddModal,
    setCreateModal
} from "../store/modules/companies";
import GomiCreateCompanyModal from "../components/GomiCreateCompanyModal";
import {Map} from "immutable";

export async function getStaticProps() {
    return {
        props: {
            title: "회사 목록",
        },
    }
}
export default function Index() {
    const dispatch = useDispatch();
    const companies = useSelector(({ companies }) => companies);
    const [editIndex, setEditIndex] = useState(null);
    const [editInputs, setEditInputs] = useState(Map({}));

    useEffect(() => {
        dispatch(requestGetCompanies());
    }, [])

    const handleCreateModalClose = () => {
        if (companies.isLoading)
            return;
        dispatch(setCreateModal(false));
    }
    const handleCreateModalShow = () => {
        dispatch(setCreateModal(true));
        setEditIndex(null);
    }
    const onChangeInput = (e) => {
        dispatch(changeInput({name:e.target.name, value:e.target.value}))
    }
    const onSubmitCreateCompany = () => {
        dispatch(requestCreateCompany(companies.inputs));
    }


    const topData = [
        {
            "name": "대기중",
            "content": 10,
            "type": "data"
        },
        {
            "name": "기존 수수료 미확인",
            "content": 30,
            "type": "open-cases"
        },
        {
            "name": "확정 수수료 미확인",
            "content": 400,
            "type": "work-orders"
        },
        {
            "name": "계약 완료",
            "content": 123,
            "type": "new-invoices"
        }
    ]


    return (
        <Container fluid className="px-lg-4 px-xl-5">
            <section className="mb-3 mb-lg-5">
                <Row>
                    {topData.map((item, index) => {
                        let color
                        let icon
                        switch (item.type) {
                            case "open-cases":
                                color = "green"
                                icon = faClipboard
                                break
                            case "work-orders":
                                color = "blue"
                                icon = faDollyFlatbed
                                break
                            case "new-invoices":
                                color = "red"
                                icon = faReceipt
                                break
                            default:
                                color = "indigo"
                                icon = faServer
                        }

                        return (
                            <Col xl={3} md={6} className="mb-4" key={index}>
                                <Pill data={item} icon={icon} color={color} fullHeight />
                            </Col>
                        )
                    })}
                </Row>
                <Row>
                    <Col lg={12} className="mb-4">
                        {/* Projects widget */}
                        <GomiCompanies data={companies.data} lightHeader handleCreateModalShow={handleCreateModalShow}/>
                    </Col>
                </Row>
            </section>


            <GomiCreateCompanyModal companies={companies} handleClose={handleCreateModalClose} show={companies.createModal} onChangeInput={onChangeInput} onSubmitAddCompany={onSubmitCreateCompany}/>
        </Container>
    )
}