import './Base.css';
import { NavLink, Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { UserHeader } from './Dashboard';
import { Form, Button, Container, Row, Col, Tab, Tabs, Nav } from 'react-bootstrap';
import axios from 'axios';


function InterestsDisplay({ interestsData, setInterestsData }) {
  const interestKeys = Object.keys(interestsData).filter(key => key !== 'userID');

  const handleButtonClick = (key) => {
    setInterestsData(prevData => ({
      ...prevData,
      [key]: prevData[key] === 1 ? 0 : 1, // Toggle between 0 and 1
    }));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'}}>
      {interestKeys.map((key) => (
        <div key={key}>
          <button
            style={{
              background: interestsData[key] === 1 ? 'black' : 'white',
              color: interestsData[key] === 1 ? 'white' : 'black',
              border: '1px solid black',
              padding: '5px 10px',
              width: 'max-content',
              minWidth: '250px',
              height: '50px',
            }}
            onClick={() => handleButtonClick(key)}
          >
            {key}
          </button>
        </div>
      ))}
    </div>
  );
}

function CoursesDisplay({ coursesData, setCoursesData }) {
  const courseKeys = Object.keys(coursesData).filter(key => key !== 'userID');
  const courseValues = Object.values(coursesData).filter(value => value !== 'userID');


  const handleCourseClick = (key, fieldName) => {
    setCoursesData(prevData => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        [fieldName]: prevData[key][fieldName] === 1 ? 0 : 1, // toggle between 0 and 1 testing discord
      },
    }));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'}}>
      {courseKeys.map((key, index) => (
        <div className="mt-3" key={key}>
          <h2 style={{textAlign: 'center', marginBottom: '20px', marginTop: '30px'}}> {key}</h2>
          <div className ="mt-3" style={{ background: '#f9f9f9', border: '1px solid black', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', outline: '1px solid black', padding: '20px', borderRadius: '10px'}}>
            {Object.entries(courseValues[index]).filter(([fieldName]) => fieldName !== 'userID').map(([fieldName, value]) => (
              <button
                key={fieldName}
                style={{
                  background: value === 1 ? 'black' : 'white',
                  color: value === 1 ? 'white' : 'black',
                  border: '1px solid black',
                  padding: '5px 10px',
                  width: 'max-content',
                  minWidth: '250px',
                  height: '50px',
                }}
                onClick={() => handleCourseClick(key, fieldName)}
              >
                {fieldName}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const EditProfile = () => {
    // Changes the current user (keeping main's comment but using auth logic)
    const userID = localStorage.getItem('userID') || 2;

  const [profileInfo, setProfileInfo] = useState({
    name: 'empty',
    interests: 'empty',
    history: 'empty',
    expertise: 'empty',
    affiliation: 'empty',
  });


  //get all interests
  const [allInterests, setAllInterests] = useState([]);

  useEffect(() => {
    const fetchInterests = async () => {
        try {
            const response = await fetch(`http://localhost:5000/interests/${userID}`);
            const data = await response.json();
            setAllInterests(data);
        } catch (error) {
            console.error('Error fetching interests:', error)
        }
    };
    fetchInterests();
}, [userID]);

  // const [contactInfo, setContactInfo] = useState({
  //   email: '',
  //   phone: '',
  // });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/${userID}`);
        const data = await response.json();
        setProfileInfo(data[0]);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [userID]);

  useEffect(() => {
    console.log('profileInfo', profileInfo);
    console.log(profileInfo.name);
  }, [profileInfo]);

  const handleProfileChange = async (e) => {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/profile/${userID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileInfo),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error updating profile:', error));
  };

  //update interests
  const updateInterests = async () => {
    try {
        const response = await fetch(`http://localhost:5000/interests/${userID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(allInterests),
        });
        if (response.ok) {
            alert('Interests updated.');
            console.log('Interests updated successfully');
        } else {
            console.error('Failed to update interests');
        }
    } catch (error) {
        console.error('Error updating interests:', error);
    }
    console.log(allInterests);
  };

  const updateCourses = async () => {
    try {
      console.log('updating courses');
      const response = await fetch(`http://localhost:5000/courses/${userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userCourses),
      });
      console.log('after response');
      if (response.ok) {
        alert('Courses updated.');
        console.log('Courses updated successfully');
      } else {
        console.error('Failed to update courses');
      }
    } catch (error) {
      console.error('Error updating courses:', error);
    }
    console.log(userCourses);
  };

  const [userCoursesGrouped, setUserCoursesGrouped] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  
  //get user courses
  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/courses/${userID}`);
        const data = await response.json();

        const courses = {}; 
        for (const interest in data) {
          courses[interest] = data[interest];
        }

        setUserCourses(courses);
        setUserCoursesGrouped(data);
      } catch (error) {
        console.error('Error fetching user courses:', error);
      }
    };
    fetchUserCourses();
  }, [userID]);
  

  return (
    <div>
      <UserHeader name={profileInfo.name} />

      <Container>
      <Tab.Container id="left-tabs" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <h1>Settings</h1>
          <Nav variant="pills" className="flex-column custom-pills">
            <Nav.Item>
              <Nav.Link eventKey="first">Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Interests</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">Courses</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <h1 className="text-center mt-4">Edit Profile Information</h1>
              <p className="text-center mb-4 text-muted">View and make changes to your profile.</p>
              <div className='form-container'>
                <Form onSubmit={handleSubmitProfile} className="mt-3">
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                      Full Name:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        type="text"
                        name="name"
                        value={profileInfo.name || ''}
                        onChange={handleProfileChange}
                        required
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                      Interests:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        type="text"
                        name="interests"
                        value={profileInfo.interests || ''}
                        onChange={handleProfileChange}
                        required
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                      Affiliation:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        type="text"
                        name="affiliation"
                        value={profileInfo.affiliation || ''}
                        onChange={handleProfileChange}
                        required
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                      Expertise:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        type="text"
                        name="expertise"
                        value={profileInfo.expertise || ''}
                        onChange={handleProfileChange}
                        required
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                      History:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        as="textarea"
                        name="history"
                        style={{ height: '100px', resize: 'none' }}
                        value={profileInfo.history || ''}
                        onChange={handleProfileChange}
                      />
                    </Col>
                  </Form.Group>

                  <div className="text-center">
                    <Button variant="dark" type="submit">
                      Update Profile Information
                    </Button>
                  </div>
                </Form>
              </ div>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <h1 className="text-center mt-4">Edit Interests</h1>
              <p className="text-center mb-4 text-muted">View and make changes to fields you're interested in.</p>
              <div className="mt-3" style={{background: '#f9f9f9', border: '1px solid black', padding: '20px', borderRadius: '5px'}}>
                <InterestsDisplay
                interestsData={allInterests}
                setInterestsData={setAllInterests}
                />
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="dark" style={{ width: '45%' }} onClick={updateInterests}>
                  Update Interests
                  </Button>
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              <h1 className="text-center mt-4">Edit Courses</h1>
              <p className="text-center mb-4 text-muted">View and make changes to courses you're interested in.</p>
              <div >
                <CoursesDisplay
                  coursesData={userCourses}
                  setCoursesData={setUserCourses}
                />
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="dark" style={{ width: '45%' }} onClick={updateCourses}>
                  Update Courses
                  </Button>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    </Container>
  </div>

// <div>
// <UserHeader name={profileInfo.name} />

// <h1 className="text-center mt-4">Edit Profile Information</h1>
// <p className="text-center mb-4">View and make changes to your profile.</p>

// <Tabs defaultActiveKey="profile" id="profile-interests-tabs" className="mb-3" fill>
//   <Tab eventKey="profile" title="Profile Information">
//     <Form onSubmit={handleSubmitProfile} className="mt-3">
//       <Form.Group as={Row} className="mb-3">
//         <Form.Label column sm="2">
//           Full Name
//         </Form.Label>
//         <Col sm="10">
//           <Form.Control
//             type="text"
//             name="name"
//             value={profileInfo.name || ''}
//             onChange={handleProfileChange}
//             required
//           />
//         </Col>
//       </Form.Group>

//       <Form.Group as={Row} className="mb-3">
//         <Form.Label column sm="2">
//           Interests
//         </Form.Label>
//         <Col sm="10">
//           <Form.Control
//             type="text"
//             name="interests"
//             value={profileInfo.interests || ''}
//             onChange={handleProfileChange}
//             required
//           />
//         </Col>
//       </Form.Group>

//       <Form.Group as={Row} className="mb-3">
//         <Form.Label column sm="2">
//           Affiliation
//         </Form.Label>
//         <Col sm="10">
//           <Form.Control
//             type="text"
//             name="affiliation"
//             value={profileInfo.affiliation || ''}
//             onChange={handleProfileChange}
//             required
//           />
//         </Col>
//       </Form.Group>

//       <Form.Group as={Row} className="mb-3">
//         <Form.Label column sm="2">
//           Expertise
//         </Form.Label>
//         <Col sm="10">
//           <Form.Control
//             type="text"
//             name="expertise"
//             value={profileInfo.expertise || ''}
//             onChange={handleProfileChange}
//             required
//           />
//         </Col>
//       </Form.Group>

//       <Form.Group as={Row} className="mb-3">
//         <Form.Label column sm="2">
//           History
//         </Form.Label>
//         <Col sm="10">
//           <Form.Control
//             as="textarea"
//             name="history"
//             style={{ height: '100px', resize: 'none' }}
//             value={profileInfo.history || ''}
//             onChange={handleProfileChange}
//           />
//         </Col>
//       </Form.Group>

//       <div className="text-center">
//         <Button variant="secondary" type="submit">
//           Update Profile Information
//         </Button>
//       </div>
//     </Form>
//   </Tab>
//   <Tab eventKey="interests" title="Interests">
//     <div className="mt-3">
//       <InterestsDisplay
//         interestsData={allInterests}
//         setInterestsData={setAllInterests}
//       />
//       <div className="d-flex justify-content-center mt-3">
//         <Button variant="secondary" style={{ width: '45%' }} onClick={updateInterests}>
//           Update Interests
//         </Button>
//       </div>
//     </div>
//   </Tab>
// </Tabs>
// </div> 

      //  leaving in case this is needed in the future *
      //  <h2 style={{ textAlign: 'center' }}>Contact Information</h2>
      // <div className="form-container">
      //   <form onSubmit={(e) => handleSubmit(e, "contact")}>
      //     <label htmlFor="email">Email<span style={{ color: "#a19d9d"}}> (This will not change the email you use to login)</span></label>
      //     <input
      //       type="email"
      //       id="email"
      //       name="email"
      //       value={contactInfo.email}
      //       onChange={handleContactChange}
      //       required
      //     />

      //     <label htmlFor="phone">Phone Number</label>
      //     <input
      //       type="tel"
      //       id="phone"
      //       name="phone"
      //       value={contactInfo.phone}
      //       onChange={handleContactChange}
      //     />

      //     <br />
      //     <button type="submit">Update Contact Info</button>
      //   </form>
      // </div> 
  );
};

export default EditProfile;
