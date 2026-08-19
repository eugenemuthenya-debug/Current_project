### Pesa Wazi

`Version 1.0.0(Launched) codename=Mwanzo`
What we have created so far
-Sing up page
-Sign in page
-Created and use JWT tokens
-Protect routes using JWT tokens
-Added Limiter
-Verify email & authentication
-Dashboard
-Add expense
-Add budget
-Used charts and budget limit warning
-------------------------------------------------------------------

`Version 1.0.1( previous version) codename=Optimized`
(Minor updates)
-Removed month selector from All time(Latest)
-Updated our get spending route in app.py(inv)
-Created budget summary route for budget summaries(inv)
-Added description to Resent transactions(vis)
-Fixed dashboard and tutorial variable username to display proper(vis)
-Added a summary card and a counter,progress bar to add budget component which displays ,budget progress and days remaining(vis)
-Added budget progress bar on the dashboard(vis)
-Added warnings when the budget limit is exceeded(vis)
-cross-month budget calculations
-included version of the website on navbar
-included a landing page

###fixed
-Dashboard polish
-----------------------------------------------------------

`#Version 1.1.0(Current version) codename=Growth`
1.Search transactions[DONE]
2.Filters(Ready)[DONE]
-->made it work with descriptions and spending(categories)
-->decided to make a searchable text,users can search description, spending category , date and amount.
3.Category analytics[DONE]
-->we display this in the all time selector

4.Better dashboard reports.(working on it)[DONE]
-->We can create one card tht has everything summarized.
(Largest expense,-->shows category and modern date.BUild using reduce()
Average expense,-->gives the average of users spendings per month and all time as well.We take the (total spent /spendData.length)
Most frequent category,
Highest spending day,)
-->The card will be called financial insights.

5.Make it a PWA(Progressive Web Application),basically we make it installable.[PENDING]
AOB:
FILTERS: dropdown
6.Improve the dashboard[DONE]
-When user clicks this month and all time there should be a difference between the metrics card displayed in each.

 7.Finish the progress bar empty state.[Done]
 -Create the Budget Expired modal.[Postponed]
 -Build the Create New Budget flow from the modal.
 -Make the dashboard feel complete when there isn't an active budget.[]
 -If time allows, begin redesigning the All Time view into a true financial summary instead of reusing the monthly dashboard.[DONE]

 [PATCH]
`#Version 1.1.1(Current version)`
-Modified the dashboard to render everything correctly.
-Budget metrics load when the Dashboard opens.
-Budget metrics refresh after adding an expense.
-Expired budgets aren't treated as active.
-BudgetStatus properly represents the budget state.
-Empty budget cards no longer misleadingly show KSh 0.
-Month changes refresh the budget summary correctly.

[PATCH2]
-Clear console,users shouldn't be able see any credentials or tokens[DONE]
-Sign up(email verification code isn't been sent)-Email api[DONE]-had to authorize an unknown ip address.
-Sign in(display actual error if credentials are wrong or invalid)[DONE]
-Sign in navigation(add a message to display to the user that this may take a while)[How to keep backend warm].[DONE]
-Add a 404 page in case user tries unknown routes,then add catch all with a page not found display+ link home
-Hero dashboard ss placeholder either remove or add it.
 

----------------------------------------------------------------------------------------


`Version 2.0`
What we will add
-Group chama system
-AI insights
-Password resets
-Better animations
-Android Application
