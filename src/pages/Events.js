import { NavLink } from 'react-router-dom';
import styles from '../styles/Events.module.scss';
import cx from 'classnames';
import { events } from '../data/data';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SupportLink from '../components/SupportLink';
import { ReactComponent as LinkIcon } from '../media/icons/link.svg';

const timeCompare = (a, b) => {
  if (events[a].time < events[b].time) {
    return -1;
  } else if (events[a].time === events[b].time) {
    return 0;
  } else {
    return 1;
  }
}

const Events = ({ user }) => {
  const eventFigureWrapper = useRef(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [activeEventId, setActiveEventId] = useState(null);

  useEffect(() => {
    const wrapper = eventFigureWrapper.current;
    const figures = document.querySelectorAll(`.${styles['current-figure']}`);

    const stickEventFigure = () => {
      const stickFigure = (el, figure) => {
        if (el.getBoundingClientRect().top > (window.innerHeight - figure.getBoundingClientRect().width)) {
          figure.style.position = 'absolute';
          figure.style.top = '0';
        } else if (el.getBoundingClientRect().bottom > window.innerHeight) {
          figure.style.position = 'fixed';
          figure.style.bottom = '0';
          figure.style.top = 'unset';
        } else {
          figure.style.position = 'absolute';
          figure.style.bottom = '0';
          figure.style.top = 'unset';
        }
      }

      figures.forEach(figure => {
        stickFigure(wrapper, figure);
      })
    }

    window.addEventListener('scroll', stickEventFigure)

    return () => {
      window.removeEventListener('scroll', stickEventFigure);
    }
  }, [currentDay])

  return (
    <motion.div className={cx(styles.events, 'page-transition', 'container')}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0 }}
    >
      <header className={cx('page-header', styles['page-header'])}>
        <h1 className='heading'>
          <span>Event</span>
          <span>Schedule</span>
        </h1>
        <div className={cx(styles['header-btn-wrapper'])}>
          <NavLink to='/gallery' className={cx('btn', styles['intro-header-btn'])}>
            <span className={cx('btn-subtitle', styles['intro-btn-subtitle'])}>Ciencia2k22 in reels</span>
            <span className={cx('btn-text', styles['intro-btn-text'])}>Gallery</span>
            <LinkIcon />
          </NavLink>
        </div>
        <div className={cx('subtitle', styles['header-subtitle'])}>
          <h2>March.21-22</h2>
          <div>2024</div>
        </div>
      </header>
      <main className={cx(styles['main-content'])}>
        <nav className={styles['schedule-nav']}>
          <ul className={styles.tabs}>
            {['Technical Events', 'Non- Technical Events', 'Special Events.'].map((day, i) => (
              <ScheduleNavBtn key={day}
                currentDay={currentDay} day={i}
                label={day} handleDayChange={setCurrentDay} />
            ))}
          </ul>
        </nav>
        <section ref={eventFigureWrapper} className={styles['event-list-wrapper']}>
          <ul className={styles['event-list']}>
            {Object.keys(events).filter(id => events[id].day === currentDay)
              .sort(timeCompare)
              .map(id => <EventLI key={id} {...events[id]} handleHover={setActiveEventId} />)}
          </ul>
          <div className={styles['event-figures']}>
            <div className={styles.figures}>
              {Object.keys(events).filter(id => events[id].day === currentDay)
                .map(id => <EventFigure key={id} {...events[id]} isActive={activeEventId === id} />)}
            </div>
          </div>
        </section>
      </main>
      
    </motion.div>
  )
}

const ScheduleNavBtn = ({ day, currentDay, handleDayChange, label }) => (
  <li className={cx(styles.tab, { [styles.active]: currentDay === day })}>
    <button
      onClick={(e) => { e.preventDefault(); handleDayChange(day) }}
      className={styles['tab-btn']}
      type='button'
    >{label}</button>
  </li>
)

const EventLI = ({ id, title, isRegistrationOpen, venue, time, handleHover, registrationLink , KnowMoreLink }) => {

  const [showPopup, setShowPopup] = useState(false);

  const handleKnowMoreClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <li className={cx(styles['event-li'])}>
      <article className={styles['event-li-inner']}
        onMouseOut={e => { handleHover(null) }}
        onMouseOver={e => { handleHover(id) }}
      >
        <div className={styles.title}>
          {isRegistrationOpen ? (
            <a href={registrationLink} target="_blank" rel="noopener noreferrer" className={styles['registration-button']}>Register Now</a>
          ) : (
            <p>Registrations closed!</p>
          )}
          <h4>{time}</h4>
        </div>
       
        <div className={styles.time}>
          <p>{title}</p>
        </div>
      </article>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button onClick={handleClosePopup}>Close</button>
            <p>This is the popup content for event {title}.</p>
          </div>
        </div>
      )}
    </li>
  )
}




const EventFigure = ({ id, title, figureSrc, isActive = false }) => (
  figureSrc && <article key={id}
    className={cx(styles['current-figure'], { [styles.active]: isActive })}>
    <figure className={styles['img-wrapper']}>
      <img alt={title} src={figureSrc} />
    </figure>
  </article>
)

export default Events;