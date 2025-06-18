              <CalendarIcon className="mr-2 h-4 w-4 text-white dark:text-white" />
              {formData.date ? format(new Date(formData.date), "PPP") : <span>Pick a date</span>} 
          <select
            name="mood"
            value={formData.mood || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 appearance-none bg-no-repeat bg-[length:1.5em_1.5em] bg-[right_1rem_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23ffffff%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%203a1%201%200%2001.707.293l3%203a1%201%200%2001-1.414%201.414L10%205.414%207.707%207.707a1%201%200%2001-1.414-1.414l3-3A1%201%200%200110%203zm-3.707%209.293a1%201%200%20011.414%200L10%2014.586l2.293-2.293a1%201%200%20011.414%201.414l-3%203a1%201%200%2001-1.414%200l-3-3a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] pr-12 ${
              errors.mood
                ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 focus:bg-white dark:focus:bg-gray-700"
                : "border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700"
            } focus:outline-none focus:ring-4`}
            disabled={isLoading}
          >
            <option value="">Select your mood</option>
            <option value="Happy">😊 Happy</option>
            <option value="Stressed">😰 Stressed</option>
            <option value="Tired">😴 Tired</option>
            <option value="Focused">🎯 Focused</option>
          </select> 