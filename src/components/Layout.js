import React, {useEffect, useState} from "react"
import Head from "next/head"
import NextNprogress from "nextjs-progressbar"
import Header from "./Header"
import SvgIcons from "./SvgIcons"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import {useAuth} from "../hooks/useAuth";
import {useDispatch, useSelector} from "react-redux";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import apiController from "../lib/ApiController";
import {toast} from "react-toastify";
import {createSchedule, deleteSchedule, removeSchedule, updateSchedule} from "../store/modules/schedules";
import {createMessage} from "../store/modules/messages";

const Layout = (pageProps) => {
  const [sidebarShrink, setSidebarShrink] = useState(false);
  const user = useSelector(state => state.user);

  const connectPusher = () => {
      return new Echo({
          broadcaster: "pusher",
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
          encrypted: true,
          key: process.env.NEXT_PUBLIC_PUSHER_KEY,
          authorizer: (channel, options) => {
              return {
                  authorize: (socketId, callback) => {
                      apiController.post('/broadcasting/auth', {
                          socket_id: socketId,
                          channel_name: channel.name
                      })
                      .then(response => {
                          callback(false, response.data);
                      })
                      .catch(error => {
                          callback(true, error);
                      });
                  }
              };
          },
      })
  }

  const dispatch = useDispatch();
  useEffect(() => {
      if (user.isAuth) {
          const echo = connectPusher();

          echo.private(`User.${user.data.id}`)
              .listen('.message', (e) => {
                  const message = e.message;
                  toast.success(message.message)
                  dispatch(createMessage({'message':message}))
              })

          echo.private(`Schedule`)
              .listen('.update', (e) => {
                  if (e.user_id !== user.data.id)
                    dispatch(updateSchedule({schedule:e.schedule}));
              })
              .listen('.delete', (e) => {
                  if (e.user_id !== user.data.id)
                      dispatch(removeSchedule({id:e.schedule.id}));
              })
              .listen('.create', (e) => {
                  if (e.user_id !== user.data.id)
                      dispatch(createSchedule({schedule:e.schedule}));
              })


          return () => {
              echo.disconnect();
          }
      }
  }, [user.isAuth]);

  return (
    <div className={pageProps.className}>
      <Head>
        <title>
          {pageProps.title} - Admin
        </title>
      </Head>
      <NextNprogress color="#4E66F8" options={{ showSpinner: false }} />
      {!pageProps.hideHeader && (
        <Header
          setSidebarShrink={setSidebarShrink}
          sidebarShrink={sidebarShrink}
        />
      )}

      <div className="d-flex align-items-stretch">
        {!pageProps.hideSidebar && <Sidebar sidebarShrink={sidebarShrink} />}
        <div
          className={`page-holder ${
            pageProps.pageHolderClass
              ? pageProps.pageHolderClass
              : "bg-gray-100"
          }`}
        >
          {pageProps.children}
          {!pageProps.hideFooter && <Footer />}
        </div>
      </div>
      <SvgIcons />
    </div>
  )
}

export default Layout
