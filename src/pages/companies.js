import {Container, Row, Col, Card, Badge, Form} from "react-bootstrap"
import {
    faServer,
    faCheck,
    faExclamation,
    faQuestion,
    faMoneyBill
} from "@fortawesome/free-solid-svg-icons"
import Pill from "../components/Pill"
import GomiCompanies from "../components/GomiCompanies";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    changeInput, clearSearchForm,
    requestCreateCompany,
    requestGetCompanies,
    setCreateModal, setCurrentPage, setIsLoaded, setSearchForm
} from "../store/modules/companies";
import GomiCreateCompanyModal from "../components/GomiCreateCompanyModal";
import {useAuth} from "../hooks/useAuth";

export async function getStaticProps() {
    return {
        props: {
            title: "가맹점 목록"
        },
    }
}

export default function companies() {
    const dispatch = useDispatch();
    const companies = useSelector(({ companies }) => companies);
    const [isMounted, setIsMounted] = useState(false);

    // useAuth({auth:'admin',redirect:'/login'});


    useEffect(() => {
        if (!companies.isLoaded)
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
        dispatch(setIsLoaded(false));
        dispatch(clearSearchForm());
        dispatch(requestGetCompanies());
    }
    const onSubmitSingleCompanies = (e) => {
        e.preventDefault();
        dispatch(clearSearchForm());
        dispatch(requestGetCompanies({key:e.target.key.value, value:e.target.value.value}));
    }
    const onChangeSearchForm = (e) => {
        dispatch(setSearchForm({key:e.target.name, value:e.target.value}));
    }
    const onClickConditionSign = (value) => {
        dispatch(setSearchForm({key:'condition_sign', value:value}));
    }
    const onClickPage = (value) => {
        dispatch(setCurrentPage(value));
    }

    // useEffect(() => {
    //     if (!isMounted) {
    //         setIsMounted(true);
    //     }
    //     else {
    //         handleSearchCompanies();
    //     }
    // }, [companies.searchForm.created_by, companies.searchForm.type, companies.searchForm.status])

    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
        }
        else {
            handleSearchCompanies(companies.currentPage);
        }
    }, [companies.currentPage])

    const handleSearchCompanies = useCallback((page=1) => {
        let params = {...companies.searchForm};
        params.page = page;
        dispatch(requestGetCompanies(params));
    }, [companies.searchForm])


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
                        <GomiCompanies data={companies.data} isLoaded={companies.isLoaded}
                                       isLoading={companies.isLoading} lightHeader
                                       handleCreateModalShow={handleCreateModalShow}
                                       handleReload={handleReloadCompanies} onSubmitSingleCompanies={onSubmitSingleCompanies}
                                       searchForm={companies.searchForm} onChangeSearchForm={onChangeSearchForm} onClickConditionSign={onClickConditionSign}
                                       handleSearchCompanies={handleSearchCompanies} lastPage={companies.lastPage} currentPage={companies.currentPage} onClickPage={onClickPage}
                        />
                    </Col>
                </Row>
            </section>


            <GomiCreateCompanyModal companies={companies} handleClose={handleCreateModalClose} show={companies.createModal} onChangeInput={onChangeInput} onSubmitAddCompany={onSubmitCreateCompany}/>
        </Container>
    )
}