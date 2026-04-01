import "../../styles/staff.css";

export default function StaffDashboard() {
  return (
    <div className="dashboard">

      {/* HEADER */}
      <h1 className="heading">Good morning, Professor Ganesh</h1>
      <p className="subheading">Wednesday, April 20th, 2026</p>

      {/* SCHEDULE */}
<div className="card schedule-card">

  <div className="card-header">
    <div className="left">
      <div className="icon-box">
        <i className="fa-regular fa-calendar"></i>
      </div>
      <span>Today's Schedule</span>
    </div>
    <span className="view-link">View Full Schedule</span>
  </div>

  {/* SCHEDULE ITEMS */}
<div className="schedule-list">

  <div className="schedule-item">
    <div className="time">
      09:00
      <span>AM</span>
    </div>

    <div className="timeline"></div>

    <div className="details">
      <div className="title">Mathematics, Statistics</div>
      <div className="sub">Prof. Yogesh Patil</div>
    </div>

    <div className="badge blue">Inprogress</div>
  </div>

  <div className="schedule-item">
    <div className="time">
      11:30
      <span>AM</span>
    </div>

    <div className="timeline"></div>

    <div className="details">
      <div className="title">Data Structure & Algorithms</div>
      <div className="sub">Prof. Amol Payghan</div>
    </div>

    <div className="badge gray">Upcoming</div>
  </div>

  <div className="schedule-item">
    <div className="time">
      02:00
      <span>PM</span>
    </div>

    <div className="timeline"></div>

    <div className="details">
      <div className="title">Ethics in Modern AI</div>
      <div className="sub">Guest Lecture</div>
    </div>

    <div className="badge gray">Upcoming</div>
  </div>

</div>

</div>

      {/* GRID */}
      <div className="bottom-grid">

         {/* EVENTS */}
        <div className="card">
          <div className="card-title">
            <i className="fa-solid fa-thumbtack"></i> Upcoming Events
          </div>

          <div className="event">
            <div className="date-box">
              <span className="month">OCT</span>
              <strong>12</strong>
            </div>
            <div>
              <div className="title">Annual Sports Meet</div>
              <div className="sub">09:00 AM | Main Ground</div>
            </div>
          </div>

          <div className="event">
            <div className="date-box">
              <span className="month">OCT</span>
              <strong>15</strong>
            </div>
            <div>
              <div className="title">PTA General Meeting</div>
              <div className="sub">02:30 PM | Auditorium</div>
            </div>
          </div>

          <div className="event">
            <div className="date-box">
              <span className="month">OCT</span>
              <strong>20</strong>
            </div>
            <div>
              <div className="title">Science Exhibition</div>
              <div className="sub">All Day | Science wing</div>
            </div>
          </div>

          <button className="primary-btn">View More</button>
        </div>  

        {/* NOTIFICATIONS */}
        <div className="card">
  <div className="card-title notif-header">
    <div className="left">
      <i className="fa-solid fa-bell"></i>
      <span>Notifications</span>
    </div>
    <span className="view-link">View All</span>
  </div>

  {/* ITEM */}
  <div className="notif">
    <div className="icon-box">
      <i className="fa-regular fa-clock"></i>
    </div>
    <div className="notif-text">
      <div className="title">Submission Deadline Expired</div>
      <span>Just now</span>
    </div>
  </div>

  <div className="notif">
    <div className="icon-box">
      <i className="fa-regular fa-message"></i>
    </div>
    <div className="notif-text">
      <div className="title">New message from Principal</div>
      <span>5m ago</span>
    </div>
  </div>

  <div className="notif">
    <div className="icon-box">
      <i className="fa-solid fa-bullhorn"></i>
    </div>
    <div className="notif-text">
      <div className="title">Faculty Announcement</div>
      <span>2h ago</span>
    </div>
  </div>
</div>

        {/* CALENDAR */}
        <div className="card">
          <div className="card-title">
            <i className="fa-regular fa-calendar"></i> Calendar
          </div>

          <div className="calendar">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>(
              <div key={i} className={d==="Sun"?"sun":""}>{d}</div>
            ))}

            {Array.from({length:31},(_,i)=>(
              <div key={i} className={(i+1)%7===0?"sun":""}>{i+1}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}