import { Link } from 'react-router-dom';

function MessageTableReceptionM() {
  return (
    <>
      <ul className="table mt-5 mo">
        <Link to="/message-detail">
          <li className="border-b py-3">
            <ul className="flex space-between text-slate-400 mb-3">
              <li>
                <input
                  className="form-check-input mr-2"
                  type="checkbox"
                  value=""
                />
                <span className="text-sm">SONY ENTERTAINMEN</span>
              </li>
              <li className="float-left text-sm">23-09-04 [15:47]</li>
            </ul>
            <div>안녕하십니까. 구직 제의 드립니다.</div>
          </li>
        </Link>

        <Link to="/message-detail">
          <li className="border-b py-3 ">
            <ul className="flex space-between text-slate-400 mb-3">
              <li>
                <input
                  className="form-check-input mr-2"
                  type="checkbox"
                  value=""
                />
                <span className="text-sm">YAMAHA</span>
              </li>
              <li className="float-left text-sm">23-09-04 [15:47]</li>
            </ul>
            <div>안녕하십니까. 구직 제의 드립니다.</div>
          </li>
        </Link>

        <Link to="/message-detail">
          <li className="border-b py-3 ">
            <ul className="flex space-between text-slate-400 mb-3">
              <li>
                <input
                  className="form-check-input mr-2"
                  type="checkbox"
                  value=""
                />
                <span className="text-sm">NINTENDO</span>
              </li>
              <li className="float-left text-sm">23-09-04 [15:47]</li>
            </ul>
            <div>안녕하십니까. 구직 제의 드립니다.</div>
          </li>
        </Link>

        <Link to="/message-detail">
          <li className="border-b py-3 ">
            <ul className="flex space-between text-slate-400 mb-3">
              <li>
                <input
                  className="form-check-input mr-2"
                  type="checkbox"
                  value=""
                />
                <span className="text-sm">SONY ENTERTAINMENT</span>
              </li>
              <li className="float-left text-sm">23-09-04 [15:47]</li>
            </ul>
            <div>안녕하십니까. 구직 제의 드립니다.</div>
          </li>
        </Link>

        <Link to="/message-detail">
          <li className="border-b py-3 ">
            <ul className="flex space-between text-slate-400 mb-3">
              <li>
                <input
                  className="form-check-input mr-2"
                  type="checkbox"
                  value=""
                />
                <span className="text-sm">YAMAHA</span>
              </li>
              <li className="float-left text-sm">23-09-04 [15:47]</li>
            </ul>
            <div>안녕하십니까. 구직 제의 드립니다.</div>
          </li>
        </Link>

        <Link to="/message-detail">
          <li className="border-b py-3 ">
            <ul className="flex space-between text-slate-400 mb-3">
              <li>
                <input
                  className="form-check-input mr-2"
                  type="checkbox"
                  value=""
                />
                <span className="text-sm">NINTENDO</span>
              </li>
              <li className="float-left text-sm">23-09-04 [15:47]</li>
            </ul>
            <div>안녕하십니까. 구직 제의 드립니다.</div>
          </li>
        </Link>
      </ul>
    </>
  );
}

export default MessageTableReceptionM;
