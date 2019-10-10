import React, { useContext, useEffect } from 'react';
import CartContext from '../context/CartProvider';

import './Notify.css';

export default () => {
  const value = useContext(CartContext);
  const notifications = value && value.notifications;
  const hasNotifications = Array.isArray(notifications) && notifications.length;

  return hasNotifications ? (
    <section className="Notify">
      {notifications.map(note => (
        <Notification key={note.id} {...note} />
      ))}
    </section>
  ) : null;
};

const Notification = ({ id, text, type }) => {
  const value = useContext(CartContext);
  const removeNotification = value && value.removeNotification;
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <article className="Notification Animate">
      <span className="Content">
        <p className="Close" onClick={() => removeNotification(id)}>
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAABs0lEQVRIie3WsWtUQRDH8U8CESxsDCLqJWihjSBa+EeIGvMPWNgpmksp/gEWgikUBUWxsNRKMdgmVVrttBFBG0GEnIWY5DiL2yOb4M3b9y6IRQYG9s3N731n5/btLrv2j2ysRu40LuE8jqKV4l/xGW/wCl92qrgjeIwN9Cq8ixepsJFsFj8LgNu9g5mm0Hn9GdSF5rNv14XOjgjN4cUzb2nW3qjth0vAz3YQOvAnVdBpw1fvQpZ3O4u/zOJ3h2g3bH5+f7V2UPU6zqS8ffiGNRxPsdMpZ5j+egR+Gwh7WMF4yp3HgzSewLsK7WIE/lgh7uFqyt2D/Wl8q0D3IQJ3Cl7wAwczzQn8KtB1ctC4rVayd6/h97bnboGuF/1Y0urLKXdvVujNAl3Y6qrFtZTBFnAljSfwvkIbLq4bgXAdp1LeSf0Wf8dkip0Vn2DXIvBUIL6TcsawnMUfZvr7QdHhBgJPg6qb+qMqKP2Dv+SzKvVVHCoBwzllN44q7+JiKXRgbaNfBObqQgc2o1nbV3GhKXRgB3BPfPLks3yu4D+tc71t2bzeHrP1evtJf4N4nZ537f+xPwy4fAaD89ELAAAAAElFTkSuQmCC" />
        </p>
        <p className="Message">{text}</p>
      </span>
    </article>
  );
};
