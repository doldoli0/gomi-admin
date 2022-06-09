import { Container, Row, Col, Card, Badge } from "react-bootstrap"
import {
    faServer,
    faCheck,
    faExclamation,
    faQuestion,
    faMoneyBill
} from "@fortawesome/free-solid-svg-icons"
import Pill from "../components/Pill"
import GomiCompanies from "../components/GomiCompanies";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    changeInput,
    requestCreateCompany,
    requestGetCompanies,
    setCreateModal, setIsLoaded
} from "../store/modules/companies";
import GomiCreateCompanyModal from "../components/GomiCreateCompanyModal";
import {getSession, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useAuth} from "../hooks/useAuth";

export async function getStaticProps() {
    return {
        props: {
            title: "회사 목록"
        },
    }
}

export default function home() {
    const dispatch = useDispatch();
    const companies = useSelector(({ companies }) => companies);

    const auth = useAuth({user:'admin',redirect:'/login'});
    console.log(auth)
    if (auth) {
        return <div>loading...'</div>
    }




    // const router = useRouter();

    // const { status } = useSession({
    //     required: true,
    //     onUnauthenticated() {
    //         router.push('/login');
    //     },
    // })


    useEffect(() => {
        handleReloadCompanies();
    }, [])

    const handleCreateModalClose = () => {
        if (companies.isLoading)
            return;
        dispatch(setCreateModal(false));
    }
    const handleCreateModalShow = () => {
        dispatch(setCreateModal(true));
    }
    const onChangeInput = (e) => {
        dispatch(changeInput({name:e.target.name, value:e.target.value}))
    }
    const onSubmitCreateCompany = () => {
        dispatch(requestCreateCompany(companies.inputs));
    }
    const handleReloadCompanies = () => {
        dispatch(setIsLoaded(false))
        dispatch(requestGetCompanies());
    }


    const topData = [
        {
            "name": "기존 수수료 미확인",
            "content": companies.check_before_fee,
            "type": "before_fee"
        },
        {
            "name": "확정 수수료 미확인",
            "content": companies.check_after_fee,
            "type": "after_fee"
        },
        {
            "name": "계약대기",
            "content": companies.status1,
            "type": "wait"
        },
        {
            "name": "계약 완료",
            "content": companies.status2,
            "type": "close"
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
                            case "before_fee":
                                color = "gray"
                                icon = faExclamation
                                break
                            case "after_fee":
                                color = "red"
                                icon = faQuestion
                                break
                            case "wait":
                                color = "green"
                                icon = faCheck
                                break
                            case "close":
                                color = "blue"
                                icon = faMoneyBill
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
                        <GomiCompanies data={companies.data} isLoaded={companies.isLoaded} isLoading={companies.isLoading} lightHeader handleCreateModalShow={handleCreateModalShow} handleReload={handleReloadCompanies} />
                    </Col>
                </Row>
            </section>


            <GomiCreateCompanyModal companies={companies} handleClose={handleCreateModalClose} show={companies.createModal} onChangeInput={onChangeInput} onSubmitAddCompany={onSubmitCreateCompany}/>
        </Container>
    )
}